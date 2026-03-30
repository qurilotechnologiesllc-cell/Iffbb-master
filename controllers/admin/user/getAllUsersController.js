import User from "../../../models/userModel.js";
import Purchase from "../../../models/purchaseModel.js";
import Course from "../../../models/courseModel.js";

const getAllUsersController = async (req, res) => {
  try {

    const users = await User.find({}).lean();

    const updatedUsers = [];

    for (const user of users) {

      // ✅ Check if loginTime is more than 1 day old → mark Offline
      let currentStatus = user.status;

      if (user.logintime) {
        const now = new Date();
        const lastLogin = new Date(user.logintime);
        
        const diffInDays = (now - lastLogin) / (1000 * 60 * 60 * 24);

        if (diffInDays > 1) {
          currentStatus = 'Offline';

          // ✅ Persist the status update in DB
          await User.updateOne(
            { _id: user._id },
            { $set: { status: 'Offline' } }
          );
        }else{
          await User.updateOne(
            { _id: user._id },
            { $set: { status: 'Active' } }
          );
        }
      }

      // ✅ Fetch purchased course details
      let purchasedCourseDetails = [];

      if (user.purchasedCourses && user.purchasedCourses.length > 0) {

        const purchases = await Purchase.find({
          _id: { $in: user.purchasedCourses }
        }).select("course");

        const courseIds = purchases.map(p => p.course);

        const courses = await Course.find({
          _id: { $in: courseIds }
        });

        purchasedCourseDetails = courses;
      }

      updatedUsers.push({
        ...user,
        status: currentStatus,         // ✅ updated status
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