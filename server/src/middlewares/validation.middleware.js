import { body } from 'express-validator';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  body('role')
    .isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];
