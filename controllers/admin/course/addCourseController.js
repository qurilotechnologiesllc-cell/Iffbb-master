import cloudinary from '../../../utils/cloudinaryConfig.js';
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

    // Upload thumbnail to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'course_thumbnails',
            resource_type: 'image',
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          },
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(file.buffer);
    // Create course with thumbnail URL
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
