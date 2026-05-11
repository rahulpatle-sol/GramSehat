import { Router } from 'express';
import { scanMedicine, searchMedicines, addMedicine } from '../controllers/medicineController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/scan/:barcode', scanMedicine);
router.get('/search', searchMedicines);
router.post('/', authMiddleware, addMedicine);

export default router;