import Course from '../../../models/courseModel.js';

const getAllCourseController = async (req, res) => {
  try {
    const allCourses = await Course.find({});
    return res.json({ allCourses });
  } catch (error) {
    console.log(`Error while fetchign the courses -  ${error}`);
    return res.status(500).json({ message: 'Could Nort Fetch Courses Data' });
  }
};
export default getAllCourseController;
