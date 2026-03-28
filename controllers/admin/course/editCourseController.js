import cloudinary from "../../../utils/cloudinaryConfig.js";
import Course from "../../../models/courseModel.js";
import fs from "fs";

export const editCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, description, price, discountedPrice, durationToComplete } = req.body;

    let thumbnailUrl = course.courseThumbnail;

    // Upload new thumbnail
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "course_thumbnails",
        resource_type: "image",
      });

      thumbnailUrl = uploaded.secure_url;

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Update basic fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (durationToComplete) course.durationToComplete = durationToComplete;

    // Take existing values if new ones not provided
    const updatedPrice = price ? Number(price) : Number(course.price);
    const updatedDiscount = discountedPrice
      ? Number(discountedPrice)
      : Number(course.discountedPrice || 0);

    // Update price fields
    if (price) course.price = updatedPrice;
    if (discountedPrice) course.discountedPrice = updatedDiscount;

    // 🔹 Recalculate actual price
    const actualPrice = updatedPrice - (updatedPrice * updatedDiscount) / 100;
    course.actual_price = actualPrice;

    course.courseThumbnail = thumbnailUrl;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating course",
      error: error.message,
    });
  }
};
