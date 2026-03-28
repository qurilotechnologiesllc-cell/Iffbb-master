import Course from "../../../models/courseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

const submitTestController = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const { answers } = req.body;
        const userId = req.user.userId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const moduleIndex = course.modules.findIndex(
            (m) => m._id.toString() === moduleId
        );

        if (moduleIndex === -1) {
            return res.status(404).json({ message: "Module not found" });
        }

        const module = course.modules[moduleIndex];
        if (!module.test || !module.test.questions.length) {
            return res.status(400).json({ message: "No test available for this module" });
        }

        const progress = await CourseProgress.findOne({
            user: userId,
            course: courseId,
        });

        if (!progress) {
            return res.status(404).json({ message: "Course progress not found" });
        }

        // 🔥 FIX STARTS HERE
        let moduleProgress = progress.modulesProgress.find(
            (m) => m.moduleId.toString() === moduleId
        );

        // ❗ If missing → create it
        if (!moduleProgress) {
            moduleProgress = {
                moduleId,
                answers: [],
                score: 0,
                passed: false,
                completed: false,
            };
            progress.modulesProgress.push(moduleProgress);
        }

        // ✅ Now SAFE to assign
        moduleProgress.answers = answers;

        // 🧮 Calculate score
        let correct = 0;
        module.test.questions.forEach((q, i) => {
            if (answers[i]?.selectedOptionIndex === q.correctOptionIndex) {
                correct++;
            }
        });

        const score = Math.round(
            (correct / module.test.questions.length) * 100
        );

        moduleProgress.score = score;
        moduleProgress.passed = score >= module.test.passPercentage;
        moduleProgress.completed = true;

        // 🔓 Unlock next module
        if (moduleProgress.passed) {
            progress.currentUnlockedModuleIndex = Math.max(
                progress.currentUnlockedModuleIndex,
                moduleIndex + 1
            );
        }

        await progress.save();

        return res.json({
            success: true,
            score,
            passed: moduleProgress.passed,
        });
    } catch (error) {
        console.error("Submit test error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default submitTestController;
