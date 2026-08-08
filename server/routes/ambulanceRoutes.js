import { Router } from 'express';
import * as ctrl from '../controllers/ambulanceController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, ctrl.list);
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

export default router;
