import fs from "fs";
import path from "path";
import Course from "../../../models/courseModel.js";
import cloudinary, { uploadBufferToCloudinary } from '../../../utils/cloudinaryConfig.js'

export const editModuleController = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    if (title) module.title = title;
    if (description) module.description = description;

    if (file) {
      // ✅ Old Cloudinary file delete karo
      if (module.assetLink && module.assetLink.length > 0) {
        const oldUrl = module.assetLink[0];
        // Cloudinary public_id nikalo URL se
        const publicId = oldUrl
          .split("/upload/")[1]
          .replace(/^v\d+\//, "")
          .replace(/\.[^/.]+$/, "");

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw"  // PDF ke liye raw
        });
      }

      // ✅ Buffer se directly Cloudinary pe upload
      const result = await uploadBufferToCloudinary(file.buffer, {
        folder: "modules",
        resource_type: "raw",  // PDF ke liye raw
        public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`, // ✅ original naam se upload
        format: "pdf"  // ✅ yeh lagao — Cloudinary extension save karega
      });
      module.assetLink = [result.secure_url];
    }

    await course.save();
    return res.status(200).json({ message: "Module updated successfully", module });

  } catch (error) {
    console.error("Edit module error:", error);
    return res.status(500).json({ message: "Internal error", error });
  }
};