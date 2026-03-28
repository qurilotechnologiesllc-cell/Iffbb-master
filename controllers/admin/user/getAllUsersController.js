import User from "../../../models/userModel.js";
import Purchase from "../../../models/purchaseModel.js";
import Course from "../../../models/courseModel.js";

const getAllUsersController = async (req, res) => {
  try {

    const users = await User.find({}).lean();

    const updatedUsers = [];

    for (const user of users) {

      let purchasedCourseDetails = [];

      if (user.purchasedCourses && user.purchasedCourses.length > 0) {

        // 1️⃣ Find purchases
        const purchases = await Purchase.find({
          _id: { $in: user.purchasedCourses }
        }).select("course");

        // 2️⃣ Extract courseIds
        const courseIds = purchases.map(p => p.course);

        // 3️⃣ Find courses
        const courses = await Course.find({
          _id: { $in: courseIds }
        });

        purchasedCourseDetails = courses;
      }

      updatedUsers.push({
        ...user,
        purchasedCourses: purchasedCourseDetails
      });
    }

    return res.json({
      success: true,
      users: updatedUsers
    });

  } catch (error) {
    console.error("Admin fetching Users Error", error);

    return res.status(500).json({
      message: "Could Not Fetch Users"
    });
  }
};

export default getAllUsersController;