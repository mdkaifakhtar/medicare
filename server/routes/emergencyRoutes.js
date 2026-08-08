import { Router } from 'express';
import * as ctrl from '../controllers/emergencyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/stats', protect, ctrl.stats);
router.get('/', protect, ctrl.list);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.post('/:id/notes', protect, ctrl.addNote);
router.delete('/:id', protect, authorize('super_admin', 'hospital_admin'), ctrl.remove);

export default router;
