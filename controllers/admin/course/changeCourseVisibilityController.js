import Course from '../../../models/courseModel.js';

export const changeCourseVisibility = async (req, res) => {
  const { courseId } = req.params;
  try {
    if (!courseId) {
      return res.status(404).json({ message: 'Please provide course id' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'No course found' });
    }
    if (course.modules.length === 0) {
      return res.status(404).json({ message: 'Cannot Make Public As There Are No Modules' });
    }
    course.isPublic = !course.isPublic;
    await course.save();
    return res.json({ message: 'Course Visibility Is Now Changed' });
  } catch (error) {
    console.log('Error Happened while changing course status');
    return res.status(500).json({ message: 'Cannot Change Course Visibility' });
  }
};
