import express from "express";
import adminAuthMiddleware from "../../middleware/adminAuthMiddleware.js";
import { getAllCourseInquiriesController, seenNotificationController, deleteNotification } from "../../controllers/admin/inquiry/getAllCourseInquiriesController.js";

const router = express.Router();

// 🔐 Admin views all inquiries
router.get(
  "/course-inquiries",
  adminAuthMiddleware,
  getAllCourseInquiriesController
);

router.get(
  "/seen-notification/:notification_id",
  adminAuthMiddleware,
  seenNotificationController
)

router.get(
  "/delete-notification/:notification_id",
  adminAuthMiddleware,
  deleteNotification
)

export default router;
