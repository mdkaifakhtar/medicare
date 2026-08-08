import { Router } from 'express';
import * as ctrl from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, ctrl.listForUser);
router.put('/:id/read', protect, ctrl.markRead);
router.put('/read-all', protect, ctrl.markAllRead);
router.post('/', protect, ctrl.create);

export default router;
