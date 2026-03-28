import Course from '../../../models/courseModel.js';

export const getOneCourseController = async (req, res) => {
  const { courseId } = req.params;
  if (!courseId) {
    return res.status(404).json({ message: 'Course Id is missing' });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'No Course Found' });
    }
    return res.json(course);
  } catch (error) {
    console.log('Cannot fetch this course');
    return res.status(500).json({ message: 'Cannot fetch course right now' });
  }
};
