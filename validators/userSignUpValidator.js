// validators/signUpValidator.ts
import { body } from 'express-validator';

export const useSignUpValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long')
    .isLength({ max: 18 })
    .withMessage('Name must be at most 18 characters long'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Enter a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
