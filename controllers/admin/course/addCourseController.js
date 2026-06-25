import { uploadBufferToCloudinary } from '../../../utils/cloudinaryConfig.js';
import Course from '../../../models/courseModel.js';

export const addCourseController = async (req, res) => {
  try {
    const { title, description, price, discountedPrice, durationToComplete } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Thumbnail image is required' });
    }

    if (!title || !description || !price || !durationToComplete) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ streamUpload hataya — helper use karo
    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'course_thumbnails',
      resource_type: 'image',
    });

    const course = await Course.create({
      title,
      description,
      price,
      discountedPrice,
      actual_price: Number(price) - Number(price * discountedPrice / 100),
      durationToComplete,
      courseThumbnail: result.secure_url,
    });

    return res.status(201).json({ message: 'Course created', course });

  } catch (err) {
    console.error('Add course error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};