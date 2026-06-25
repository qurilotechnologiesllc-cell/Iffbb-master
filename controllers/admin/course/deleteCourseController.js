import Course from '../../../models/courseModel.js';
import cloudinary from '../../../utils/cloudinaryConfig.js';

const extractPublicId = (url) => {
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;
    let publicId = url.substring(uploadIndex + 8);
    publicId = publicId.replace(/^v\d+\//, '');
    publicId = publicId.replace(/\.[^/.]+$/, '');
    return publicId;
  } catch {
    return null;
  }
};

export const deleteCourseController = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID Not Provided' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course Not Found' });
    }

    // ✅ Step 1 — Modules exist karte hain? Error do
    if (course.modules && course.modules.length > 0) {
      return res.status(400).json({
        message: 'Please delete all modules first before deleting the course',
        modulesCount: course.modules.length
      });
    }

    // ✅ Step 2 — Modules empty hain — thumbnail delete karo
    if (course.courseThumbnail && course.courseThumbnail.includes('res.cloudinary.com')) {
      const publicId = extractPublicId(course.courseThumbnail);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    }

    // ✅ Step 3 — Course DB se delete karo
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ message: 'Course Deleted Successfully' });

  } catch (error) {
    console.error(`Error while deleting the course: ${error}`);
    return res.status(500).json({ message: 'Some Error Occurred While Deleting The Course' });
  }
};