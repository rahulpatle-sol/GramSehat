import { Router } from 'express';
import { getNearbyOutbreaks, getOutbreakHistory } from '../controllers/symptomController.js';

const router = Router();

router.get('/nearby', getNearbyOutbreaks);
router.get('/history', getOutbreakHistory);

export default router;