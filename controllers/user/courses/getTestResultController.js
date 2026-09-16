import Course from "../../../models/courseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

const getTestResultController = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const userId = req.user.userId;

        // 1️⃣ Progress fetch
        const progress = await CourseProgress.findOne({
            user: userId,
            course: courseId,
        });

        if (!progress) {
            return res.status(404).json({
                message: "Progress not found",
            });
        }

        const moduleProgress = progress.modulesProgress.find(
            (m) => m.moduleId.toString() === moduleId
        );

        if (!moduleProgress || moduleProgress.score == null) {
            return res.status(400).json({
                message: "Test not attempted yet",
            });
        }

        // 2️⃣ Course fetch
        const course = await Course.findById(courseId).lean();

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // 3️⃣ Find requested module
        const module = course.modules.find(
            (m) => m._id.toString() === moduleId
        );

        if (!module || !module.test) {
            return res.status(404).json({
                message: "Test not found",
            });
        }

        // 4️⃣ Get pass percentage from course module test
        const passPercentage = module.test.passPercentage;

        if (passPercentage == null) {
            return res.status(500).json({
                message: "Pass percentage is not configured for this test",
            });
        }

        // 5️⃣ Compare user's score with module's pass percentage
        if (moduleProgress.score < passPercentage) {
            return res.status(403).json({
                message: `Your score (${moduleProgress.score}%) is below the required pass percentage (${passPercentage}%) for this module test`,
                score: moduleProgress.score,
                passPercentage,
            });
        }

        // 6️⃣ Merge questions with user answers
        const result = module.test.questions.map((q, index) => {
            const userAnswer = moduleProgress.answers.find(
                (a) => a.questionIndex === index
            );

            const userSelectedOptionIndex =
                userAnswer?.selectedOptionIndex ?? null;

            const isCorrect =
                userSelectedOptionIndex !== null &&
                userSelectedOptionIndex === q.correctOptionIndex;

            return {
                question: q.question,
                options: q.options,
                correctOptionIndex: q.correctOptionIndex,
                userSelectedOptionIndex,
                isCorrect,
            };
        });

        // 7️⃣ Return result
        return res.json({
            success: true,
            score: moduleProgress.score,
            passPercentage,
            totalQuestions: module.test.questions.length,
            result,
        });
    } catch (error) {
        console.error("Get test result error:", error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export default getTestResultController;
