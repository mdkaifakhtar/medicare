import { Router } from 'express';
import * as ctrl from '../controllers/equipmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, ctrl.list);
router.post('/', protect, authorize('super_admin', 'hospital_admin'), ctrl.create);
router.put('/:id', protect, authorize('super_admin', 'hospital_admin'), ctrl.update);
router.delete('/:id', protect, authorize('super_admin', 'hospital_admin'), ctrl.remove);

export default router;
