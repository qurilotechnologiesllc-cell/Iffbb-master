import Course from '../../../models/courseModel.js';

const getAllCourseController = async (req, res) => {
  try {
    const allCourses = await Course.find().lean();

    const coursesWithRating = allCourses.map(course => {
      const ratings = course.ratings || [];
      const averageRating = ratings.length > 0
        ? Number((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1))
        : 0;

      return { ...course, averageRating };  // ✅ sirf ek field add, baki sab same
    });

    res.status(200).json({
      success: true,
      allCourses: coursesWithRating
    });
  } catch (error) {
    console.log(`Error while fetchign the courses -  ${error}`);
    return res.status(500).json({ message: 'Could Nort Fetch Courses Data' });
  }
};
export default getAllCourseController;
