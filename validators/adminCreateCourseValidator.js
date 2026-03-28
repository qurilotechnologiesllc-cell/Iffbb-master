import { body } from 'express-validator';

export const adminCreateCourseValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('discountedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discounted price must be a non-negative number')
    .custom((value, { req }) => {
      if (value >= parseFloat(req.body.price)) {
        throw new Error('Discounted price must be less than original price');
      }
      return true;
    }),

  body('durationToComplete')
    .notEmpty()
    .withMessage('Duration to complete is required')
    .isInt({ min: 10 })
    .withMessage('Duration must be at least 10 minutes'),
];
