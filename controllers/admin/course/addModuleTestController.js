import Course from "../../../models/courseModel.js";

const addModuleTestController = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const { questions } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        const module = course.modules.id(moduleId);
        if (!module) return res.status(404).json({ message: "Module not found" });

        module.test = {
            questions,
            passPercentage: 60,
        };

        await course.save();

        return res.json({ message: "Test added to module" });
    } catch (error) {
        return res.status(500).json({ message: "Error adding test" });
    }
};

export default addModuleTestController;
