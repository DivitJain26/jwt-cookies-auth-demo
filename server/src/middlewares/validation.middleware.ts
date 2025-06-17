import { body } from 'express-validator';

export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),

    body('email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),

    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),

    body('role')
        .trim()
        .isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
];

export const validateLogin = [
    body('email')
        .trim().normalizeEmail().isEmail().withMessage('Invalid email address'),

    body('password')
        .notEmpty().withMessage('Password is required'),
];
