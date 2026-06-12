import { Router } from 'express';
import {
  reportSymptoms, getNearbyOutbreaks, getOutbreakHistory, getSymptomHistory,
  verifyResidence, getTrustScore,
} from '../controllers/symptomController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/report', authMiddleware, reportSymptoms);
router.get('/nearby', getNearbyOutbreaks);
router.get('/history', authMiddleware, getSymptomHistory);
router.post('/verify-residence', authMiddleware, verifyResidence);
router.get('/trust-score', authMiddleware, getTrustScore);

export default router;
