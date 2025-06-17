import express from 'express';
import { login, register, refreshToken, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware';
import { validationErrors } from '../middlewares/validationResult.middleware';

const router = express.Router();

router.post('/register', validateRegister, validationErrors, register);
router.post('/login', validateLogin, validationErrors, login);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.get('/me', authenticate, getCurrentUser);



export default router;