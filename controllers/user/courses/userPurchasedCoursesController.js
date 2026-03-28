import User from "../../../models/userModel.js";
import Purchase from "../../../models/purchaseModel.js";
import Course from "../../../models/courseModel.js";

const userPurchasedCoursesController = async (req, res) => {
  try {

    const userId = req.user.userId;

    // 1️⃣ Get user
    const user = await User.findById(userId).select("purchasedCourses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Get purchase documents
    const purchases = await Purchase.find({
      _id: { $in: user.purchasedCourses }
    });

    // 3️⃣ Extract courseIds
    const courseIds = purchases.map(p => p.course);

    // 4️⃣ Fetch courses
    const courses = await Course.find({
      _id: { $in: courseIds }
    }).lean();

    // 5️⃣ Format response
    const formattedCourses = courses.map(course => {

      const totalModules = course.modules?.length || 0;

      const { modules, ...courseWithoutModules } = course;

      return {
        ...courseWithoutModules,
        totalModules,
        hasPurchased: true
      };
    });

    return res.status(200).json({
      success: true,
      purchasedCourses: formattedCourses
    });

  } catch (error) {
    console.error("User Purchased Courses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch purchased courses",
    });
  }
};

export default userPurchasedCoursesController;