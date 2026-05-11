import { Router } from 'express';
import { reportSymptoms, getNearbyOutbreaks, getOutbreakHistory, getSymptomHistory } from '../controllers/symptomController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/report', authMiddleware, reportSymptoms);
router.get('/nearby', getNearbyOutbreaks);
router.get('/history', authMiddleware, getSymptomHistory);

export default router;