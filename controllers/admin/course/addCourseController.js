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

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        message: 'Description should be at least 10 characters long'
      });
    }

    // ✅ price validation — must be a valid number greater than 0
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than zero' });
    }

    // ✅ discountedPrice optional, but if present must be valid and < price
    let numericDiscount = 0;
    if (discountedPrice !== undefined && discountedPrice !== null && discountedPrice !== '') {
      numericDiscount = Number(discountedPrice);
      if (isNaN(numericDiscount) || numericDiscount <= 0) {
        return res.status(400).json({ message: 'Discounted price must be a valid number greater than zero' });
      }
      if (numericDiscount >= numericPrice) {
        return res.status(400).json({ message: 'Discounted price must be less than price' });
      }
    }

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder: 'course_thumbnails',
      resource_type: 'image',
    });

    // ✅ actual_price = price minus discount% (0 if no discount given)
    const actualPrice = numericDiscount
      ? numericPrice - (numericPrice * numericDiscount) / 100
      : numericPrice;

    const course = await Course.create({
      title,
      description,
      price,
      discountedPrice,
      actual_price: actualPrice,
      durationToComplete,
      courseThumbnail: result.secure_url,
    });

    return res.status(201).json({ message: 'Course created', course });

  } catch (err) {
    console.error('Add course error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};