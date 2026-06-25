import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ Buffer se directly Cloudinary pe upload (memory storage ke saath use karo)
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
  return result.secure_url;
};

export const uploadLargeFile = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "video",
    chunk_size: 6 * 1024 * 1024,
  });
  return result.secure_url;
};

export default cloudinary;