import Course from '../../../models/courseModel.js';

const getAllCourseController = async (req, res) => {
  try {
    const allCourses = await Course.find({});

    const modifyResponse = allCourses.map((course)=>{
      const totalRatings = course.ratings?.length || 0;
      const averageRating =
        totalRatings > 0
          ? parseFloat(
            (course.ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings).toFixed(1)
          )
          : 0;
      return {
        course,
        rating: averageRating,   // ✅ average rating field
        totalRatings,            // ✅ total number of ratings
      };
    })
    return res.json({ modifyResponse });
  } catch (error) {
    console.log(`Error while fetchign the courses -  ${error}`);
    return res.status(500).json({ message: 'Could Nort Fetch Courses Data' });
  }
};
export default getAllCourseController;
