import express from 'express';
import { login, register, refreshToken, getCurrentUser, logout } from '../controllers/auth.controller.ts';
import { authenticate } from '../middlewares/auth.middleware.ts';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.ts';
import { validationErrors } from '../middlewares/validationResult.middleware.ts';

const router = express.Router();

router.post('/register', validateRegister, validationErrors, register);
router.post('/login', validateLogin, validationErrors, login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.get('/me', authenticate, getCurrentUser);



export default router;