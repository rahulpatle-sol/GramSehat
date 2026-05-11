import { Router } from 'express';
import { getNearbyPhc, getPhcDetails, searchPhc } from '../controllers/phcController.js';

const router = Router();

router.get('/nearby', getNearbyPhc);
router.get('/search', searchPhc);
router.get('/:id', getPhcDetails);

export default router;