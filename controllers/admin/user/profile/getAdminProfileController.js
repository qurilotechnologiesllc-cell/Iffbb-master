import Admin from "../../../../models/adminModel.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary, uploadBufferToCloudinary } from "../../../../utils/cloudinaryConfig.js";
import cloudinary from "../../../../utils/cloudinaryConfig.js";
import fs from "fs";

const extractPublicId = (url) => {
    try {
        const uploadIndex = url.indexOf('/upload/');
        if (uploadIndex === -1) return null;
        let publicId = url.substring(uploadIndex + 8);
        publicId = publicId.replace(/^v\d+\//, '');
        publicId = publicId.replace(/\.[^/.]+$/, '');
        return publicId;
    } catch {
        return null;
    }
};


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

        const { fullName, email, currentPassword, newPassword, confirmPassword } = req.body;

        if (fullName) admin.fullName = fullName;
        if (email) admin.email = email;

        // ✅ Profile image update
        if (req.file) {
            // Pehle purani image Cloudinary se delete karo
            if (admin.image && admin.image.includes('res.cloudinary.com')) {
                const publicId = extractPublicId(admin.image);
                if (publicId) {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
                }
            }

            // Nayi image buffer se upload karo
            const result = await uploadBufferToCloudinary(req.file.buffer, {
                folder: "admin_profiles",
                resource_type: "image",
            });

            admin.image = result.secure_url;
        }

        // ✅ Password update
        if (newPassword || confirmPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: "Current password is required" });
            }

            const isMatch = await bcrypt.compare(currentPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Current password is incorrect" });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Passwords do not match" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            }

            admin.password = await bcrypt.hash(newPassword, 10);
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
        return res.status(500).json({ success: false, message: "Could not update profile" });
    }
};


