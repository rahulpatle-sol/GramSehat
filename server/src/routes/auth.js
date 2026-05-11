import { Router } from 'express';
import { googleAuth, sendOTP, verifyOTP, updateProfile, getProfile, updateFcmToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { otpLimiter, authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/google', authLimiter, googleAuth);
router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', authLimiter, verifyOTP);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);
router.put('/fcm-token', authMiddleware, updateFcmToken);

export default router;