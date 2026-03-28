import User from "../../../models/userModel.js";
import Course from "../../../models/courseModel.js";
import Purchase from "../../../models/purchaseModel.js";

export const getAllCoursesController = async (req, res) => {
  try {

    const { userId } = req.query;

    let query = { isPublic: true };

    if (userId) {

      // 1️⃣ Find user
      const user = await User.findById(userId).select("purchasedCourses");

      if (user && user.purchasedCourses.length > 0) {

        // 2️⃣ Find purchases
        const purchases = await Purchase.find({
          _id: { $in: user.purchasedCourses }
        }).select("course");

        // 3️⃣ Extract courseIds
        const purchasedCourseIds = purchases.map(p => p.course);

        // 4️⃣ Exclude purchased courses
        query._id = { $nin: purchasedCourseIds };
      }
    }

    const courses = await Course.find(query).lean();

    return res.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error("Fetching Error Course:", error);

    return res.status(500).json({
      success: false,
      message: "Could Not Fetch Courses",
    });
  }
};