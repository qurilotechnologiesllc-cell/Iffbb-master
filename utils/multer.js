import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Upload directory
const uploadDir = path.join(process.cwd(), "uploads");

// Create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ---------------------
// DISK STORAGE (Cloudinary friendly)
// ---------------------
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ---------------------
// MEMORY STORAGE (NOT for large files)
// ---------------------
const memoryStorage = multer.memoryStorage();

// ---------------------
// Allowed file types (optional + safer)
// ---------------------
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
  "video/mp4",
  "video/mkv",
  "video/quicktime",
  "application/pdf",
  "application/zip",
];

// ---------------------
// FINAL UPLOADER → Unlimited size + Type-safe
// ---------------------
export const getUploader = (type = "disk") => {
  const storage = type === "memory" ? memoryStorage : diskStorage;

  return multer({
    storage,

    limits: {
      fileSize: 200 * 1024 * 1024 // 200MB
    },

    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type!"));
      }
      cb(null, true);
    },
  });
};
