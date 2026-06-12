import { Router } from 'express';
import { googleAuth, updateProfile, getProfile, updateFcmToken } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/google', authLimiter, googleAuth);
router.put('/profile', authMiddleware, updateProfile);
router.get('/profile', authMiddleware, getProfile);
router.put('/fcm-token', authMiddleware, updateFcmToken);

export default router;
