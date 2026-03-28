import Admin from "../../../../models/adminModel.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../../../utils/cloudinaryConfig.js";
import fs from "fs";
export const getAdminProfileController = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Get admin profile error:", error);
        return res.status(500).json({ success: false, message: "Could not fetch profile" });
    }
};


export const updateAdminProfileController = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const {
            fullName,
            email,
            currentPassword,
            newPassword,
            confirmPassword,
        } = req.body;

        /* =====================
           BASIC PROFILE UPDATE
        ===================== */
        if (fullName) admin.fullName = fullName;
        if (email) admin.email = email;

        /* =====================
           PROFILE IMAGE UPLOAD
        ===================== */
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.path);
            admin.image = imageUrl;

            // remove temp file
            fs.unlinkSync(req.file.path);
        }

        /* =====================
           PASSWORD UPDATE
        ===================== */
        if (newPassword || confirmPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is required",
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Current password is incorrect",
                });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Passwords do not match",
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedPassword;
        }

        await admin.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            admin: {
                fullName: admin.fullName,
                email: admin.email,
                image: admin.image,
            },
        });
    } catch (error) {
        console.error("Update admin profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Could not update profile",
        });
    }
};


