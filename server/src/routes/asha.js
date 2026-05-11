import { Router } from 'express';
import { getAshaAlerts, resolveAlert, getAshaReports } from '../controllers/ashaController.js';
import { authMiddleware } from '../middleware/auth.js';
import { roleMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/alerts', authMiddleware, roleMiddleware('asha_worker', 'admin'), getAshaAlerts);
router.put('/alert/:id/resolve', authMiddleware, roleMiddleware('asha_worker', 'admin'), resolveAlert);
router.get('/reports', authMiddleware, roleMiddleware('asha_worker', 'admin'), getAshaReports);

export default router;