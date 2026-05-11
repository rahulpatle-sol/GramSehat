import { Router } from 'express';
import { getHealthRecords, addHealthRecord, getHealthRecord, deleteHealthRecord } from '../controllers/recordController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getHealthRecords);
router.post('/', authMiddleware, addHealthRecord);
router.get('/:id', authMiddleware, getHealthRecord);
router.delete('/:id', authMiddleware, deleteHealthRecord);

export default router;