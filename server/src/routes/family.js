import { Router } from 'express';
import { getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../controllers/familyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, getFamilyMembers);
router.post('/', authMiddleware, addFamilyMember);
router.put('/:id', authMiddleware, updateFamilyMember);
router.delete('/:id', authMiddleware, deleteFamilyMember);

export default router;