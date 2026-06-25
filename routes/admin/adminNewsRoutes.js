import express from "express";
import adminAuthMiddleware from "../../middleware/adminAuthMiddleware.js";
import { getUploader } from "../../utils/multer.js";

import createNewsController from "../../controllers/admin/news/createNewsController.js";
import updateNewsController from "../../controllers/admin/news/updateNewsController.js";
import deleteNewsController from "../../controllers/admin/news/deleteNewsController.js";

const router = express.Router();

// 🟢 CREATE news (Cloudinary image)
router.post(
  "/news",
  adminAuthMiddleware,
  getUploader().single("image"), // ✅ ONLY CHANGE
  createNewsController
);

// 🟡 UPDATE news (optional image)
router.put(
  "/news/:id",
  adminAuthMiddleware,
  getUploader().single("image"), // ✅ ONLY CHANGE
  updateNewsController
);

// 🔴 DELETE news
router.delete(
  "/news/:id",
  adminAuthMiddleware,
  deleteNewsController
);

export default router;
