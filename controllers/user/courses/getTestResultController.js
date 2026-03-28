import Course from "../../../models/courseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

const getTestResultController = async (req, res) => {
    try {
        const { courseId, moduleId } = req.params;
        const userId = req.user.userId;

        // 1️⃣ progress fetch
        const progress = await CourseProgress.findOne({
            user: userId,
            course: courseId,
        });

        if (!progress) {
            return res.status(404).json({ message: "Progress not found" });
        }

        const moduleProgress = progress.modulesProgress.find(
            (m) => m.moduleId.toString() === moduleId
        );

        if (!moduleProgress || moduleProgress.score == null) {
            return res.status(400).json({ message: "Test not attempted yet" });
        }

        // ❌ agar pass nahi kiya → deny
        if (moduleProgress.score < 60) {
            return res.status(403).json({
                message: "You must score at least 60% to view test result",
            });
        }

        // 2️⃣ course + module fetch
        const course = await Course.findById(courseId).lean();
        const module = course.modules.find(
            (m) => m._id.toString() === moduleId
        );

        if (!module || !module.test) {
            return res.status(404).json({ message: "Test not found" });
        }

        // 3️⃣ merge question + user answer
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

        return res.json({
            success: true,
            score: moduleProgress.score,
            totalQuestions: module.test.questions.length,
            result,
        });
    } catch (error) {
        console.error("Get test result error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export default getTestResultController;
