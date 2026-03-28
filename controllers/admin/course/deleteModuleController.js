import fs from "fs";
import path from "path";
import Course from "../../../models/courseModel.js";

export const deleteModuleController = async (req, res) => {

  const { moduleId } = req.params;

  if (!moduleId) {
    return res.status(400).json({
      message: "No Module Id Provided"
    });
  }

  try {

    // find course containing this module
    const course = await Course.findOne({ "modules._id": moduleId });

    if (!course) {
      return res.status(404).json({
        message: "Module not found"
      });
    }

    const module = course.modules.id(moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found"
      });
    }

    // ✅ assetLink is now an ARRAY
    if (module.assetLink && module.assetLink.length > 0) {

      for (const link of module.assetLink) {

        const fileName = link.split("/uploads/")[1];

        if (!fileName) continue;

        const filePath = path.join(
          process.cwd(),
          "uploads",
          fileName
        );

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // remove module from course
    course.modules.pull(moduleId);

    await course.save();

    return res.status(200).json({
      message: "Module and files deleted successfully"
    });

  } catch (error) {

    console.error("Cannot delete module", error);

    return res.status(500).json({
      message: "Cannot Delete Module"
    });

  }
};