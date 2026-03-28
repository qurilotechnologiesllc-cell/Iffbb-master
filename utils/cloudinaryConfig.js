import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

// -------- Cloudinary Config --------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

// ---------- Helper Upload Functions ----------

// Normal upload (<=100MB)
export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Normal Upload Error:", error);
    throw error;
  }
};

// Large file upload (>100MB)
export const uploadLargeFile = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video", // auto bhi chalega
      chunk_size: 6 * 1024 * 1024, // 6MB chunk
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Large Upload Error:", error);
    throw error;
  }
};

export default cloudinary;
