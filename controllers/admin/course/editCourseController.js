import cloudinary from "../../../utils/cloudinaryConfig.js";
import { uploadBufferToCloudinary } from "../../../utils/cloudinaryConfig.js";
import Course from "../../../models/courseModel.js";

export const editCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, description, price, discountedPrice, durationToComplete } = req.body;

    let thumbnailUrl = course.courseThumbnail;

    // ✅ Buffer se directly Cloudinary pe upload — disk touch nahi hoga
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "course_thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = result.secure_url;
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (durationToComplete) course.durationToComplete = durationToComplete;

    const updatedPrice = price ? Number(price) : Number(course.price);
    const updatedDiscount = discountedPrice ? Number(discountedPrice) : Number(course.discountedPrice || 0);

    if (price) course.price = updatedPrice;
    if (discountedPrice) course.discountedPrice = updatedDiscount;

    course.actual_price = updatedPrice - (updatedPrice * updatedDiscount) / 100;
    course.courseThumbnail = thumbnailUrl;

    await course.save();

    res.status(200).json({ message: "Course updated successfully", course });

  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};