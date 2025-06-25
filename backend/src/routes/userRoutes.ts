import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';
import { verifyRecaptcha } from '../middleware/recaptcha';

const router = express.Router();

// Public routes with reCAPTCHA protection
router.post('/register', verifyRecaptcha, registerUser);
router.post('/login', verifyRecaptcha, loginUser);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router; 