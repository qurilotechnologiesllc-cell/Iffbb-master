import multer from "multer";

const memoryStorage = multer.memoryStorage();

const allowedTypes = [
  "image/jpeg", "image/png", "image/webp", "image/jpg",
  "video/mp4", "video/mkv", "video/quicktime",
  "application/pdf", "application/zip",
];

export const getUploader = () => {
  return multer({
    storage: memoryStorage,
    limits: { fileSize: 200 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Unsupported file type!"));
      }
      cb(null, true);
    },
  });
};