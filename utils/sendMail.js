import nodemailer from "nodemailer";

const sendOtpMail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    });


    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        html: `
      <div style="font-family: Arial; text-align:center;">
        <h2>Hi welcome to Qurilio Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#4CAF50;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendOtpMail;