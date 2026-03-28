import Course from "../../../models/courseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

const markModuleCompleteController = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const userId = req.user.userId;

    const progress = await CourseProgress.findOne({
        user: userId,
        course: courseId,
    });
    if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
    }

    const moduleIndex = progress.modulesProgress.findIndex(
        (m) => m.moduleId.toString() === moduleId
    );

    if (moduleIndex === -1) {
        return res.status(404).json({ message: "Module progress not found" });
    }

    const moduleProgress = progress.modulesProgress[moduleIndex];
    moduleProgress.completed = true;

    // 🔹 check if module has test
    const course = await Course.findById(courseId).lean();
    const module = course.modules.find(
        (m) => m._id.toString() === moduleId
    );

    const hasTest =
        module?.test &&
        Array.isArray(module.test.questions) &&
        module.test.questions.length > 0;

    // 🔥 MAIN LOGIC
    if (!hasTest) {
        // 👉 no test → unlock next module
        if (progress.currentUnlockedModuleIndex === moduleIndex) {
            progress.currentUnlockedModuleIndex += 1;
        }
    }

    await progress.save();

    return res.json({
        message: hasTest
            ? "Module completed. Test unlocked."
            : "Module completed. Next module unlocked.",
        hasTest,
        unlockedUpto: progress.currentUnlockedModuleIndex,
    });
};

export default markModuleCompleteController;
