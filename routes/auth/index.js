import { Router } from 'express';
import { login, register } from '../../controllers/auth.js';

const router = Router();

// @route   POST login
router.post('/login', login);

// @route   POST register
router.post('/register', register);

export default router;
