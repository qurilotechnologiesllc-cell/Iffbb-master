import Course from '../../../models/courseModel.js';

export const deleteCourseController = async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    return res.status(404).json({ message: 'Course ID Not Provided' });
  }
  try {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course Not Found' });
    }
    return res.status(200).json({ message: 'Course Deleted Successfully' });
  } catch (error) {
    console.log(`Error while deleting the course -  ${error}`);
    return res.status(500).json({ message: 'Some Error Occurred While Deleting The Course' });
  }
};
