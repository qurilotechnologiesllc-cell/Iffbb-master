import fs from "fs";
import path from "path";
import Course from "../../../models/courseModel.js";

export const editModuleController = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  console.log(file);
  

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    if (title) module.title = title;
    if (description) module.description = description;

    if (file) {
      // ✅ assetLink array hai — pehli value se old file nikalo
      if (module.assetLink && module.assetLink.length > 0) {
        const oldFileName = module.assetLink[0].split("/uploads/")[1];
        const oldFilePath = path.join(process.cwd(), "uploads", oldFileName);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

      // ✅ Array mein assign karo
      module.assetLink = [fileUrl];
    }

    await course.save();
    return res.status(200).json({ message: "Module updated successfully", module });

  } catch (error) {
    console.error("Edit module error:", error);
    return res.status(500).json({ message: "Internal error", error });
  }
};