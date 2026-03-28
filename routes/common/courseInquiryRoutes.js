import express from "express";
import createCourseInquiryController from "../../controllers/common/createCourseInquiryController.js";

const router = express.Router();

// 👤 User submits inquiry form
router.post("/course-inquiry", createCourseInquiryController);

export default router;
