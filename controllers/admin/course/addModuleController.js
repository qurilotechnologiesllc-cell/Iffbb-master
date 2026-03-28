import Course from "../../../models/courseModel.js";


export const addModuleController = async (req, res) => {

  const { courseId } = req.params;
  const { title, description, type } = req.body;
  const files = req.files;

  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  if (!files || files.length === 0 || !title || !type) {
    return res.status(400).json({
      message: "All module fields and files are required",
    });
  }

  if (!["video", "pdf"].includes(type)) {
    return res.status(400).json({
      message: "Invalid module type",
    });
  }

  try {

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }

    const BASE_URL = process.env.BASE_URL;

    // create urls
    const assetLinks = files.map(file =>
      `${BASE_URL}/uploads/${file.filename}`
    );

    const newModule = {
      title,
      description,
      type,
      assetLink: assetLinks, // ✅ array save
    };

    course.modules.push(newModule);

    await course.save();

    const addedModule = course.modules[course.modules.length - 1];

    return res.status(201).json({
      message: "Module added successfully",
      module: addedModule,
    });

  } catch (error) {

    console.error("Add module error:", error);

    return res.status(500).json({
      message: "Internal error",
      error,
    });

  }
};