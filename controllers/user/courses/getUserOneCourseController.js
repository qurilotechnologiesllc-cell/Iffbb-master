import Course from "../../../models/courseModel.js";
import Purchase from "../../../models/purchaseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

export const getUserOneCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🟡 Guest user
    if (!req.user?.userId) {
      course.modules = course.modules.map(({ assetLink, test, ...m }) => ({
        ...m,
        locked: true,
        test: test
          ? {
            ...test,
            questions: test.questions.map(
              ({ correctOptionIndex, ...q }) => q
            ),
          }
          : undefined,
      }));

      return res.json({
        success: true,
        course,
        isLoggedIn: false,
      });
    }

    const userId = req.user.userId;

    // ✅ ONLY SOURCE OF PURCHASE TRUTH
    const purchase = await Purchase.findOne({
      user: userId,
      course: courseId,
      paymentStatus: "paid",
    });

    const hasPurchased = !!purchase;

    // 🔒 Not purchased
    if (!hasPurchased) {
      course.modules = course.modules.map(({ assetLink, test, ...m }) => ({
        ...m,
        locked: true,
        test: test
          ? {
            ...test,
            questions: test.questions.map(
              ({ correctOptionIndex, ...q }) => q
            ),
          }
          : undefined,
      }));

      return res.json({
        success: true,
        course,
        hasPurchased: false,
      });
    }

    // 🔓 Purchased → unlock based on progress
    const progress = await CourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    const unlockedUpto = progress?.currentUnlockedModuleIndex ?? 0;

    course.modules = course.modules.map((module, index) => {
      const safeTest = module.test
        ? {
          ...module.test,
          questions: module.test.questions.map(
            ({ correctOptionIndex, ...q }) => q
          ),
        }
        : undefined;

      if (index <= unlockedUpto) {
        return {
          ...module,
          locked: false,
          test: safeTest,
        };
      }

      const { assetLink, ...safeModule } = module;
      return {
        ...safeModule,
        locked: true,
        test: safeTest,
      };
    });

    return res.json({
      success: true,
      course,
      hasPurchased: true,
      unlockedUpto,
    });
  } catch (error) {
    console.error("Get one course error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
