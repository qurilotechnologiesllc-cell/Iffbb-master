import User from "../../../models/userModel.js"
import redis from "../../../utils/redisClients.js"
import sendOtpMail from "../../../utils/sendMail.js" 
import bcrypt from "bcrypt"


 export const userForgotController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        

        // store OTP in redis (5 min expiry)
        await redis.set(`reset-password:${email}`, otp, "EX", 300);

        // send email
        await sendOtpMail(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const verifyOtpAndUpdatePassword = async (req, res) => {
    try {
        const { otp, email, new_password } = req.body;
        console.log(otp, email, new_password);
        
        if (!otp || !email || !new_password) {
            return res.status(400).json({
                success: false,
                message: "OTP, email and new password are required",
            });
        }

        const redisKey = `reset-password:${email}`;

        // get otp from redis
        const storedOtp = await redis.get(redisKey);

        if (!storedOtp) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found",
            });
        }

        // compare otp
        if (storedOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // update password
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        // delete otp from redis
        await redis.del(redisKey);

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

