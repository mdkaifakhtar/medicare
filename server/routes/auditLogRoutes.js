import { Router } from 'express';
import * as ctrl from '../controllers/auditLogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('super_admin', 'hospital_admin'), ctrl.list);
router.post('/', protect, ctrl.create);

export default router;
