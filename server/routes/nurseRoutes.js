import { Router } from 'express';
import * as ctrl from '../controllers/nurseController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/assignments', protect, ctrl.listAssignments);
router.post('/assignments', protect, authorize('super_admin', 'hospital_admin', 'nurse'), ctrl.createAssignment);
router.put('/assignments/:id', protect, authorize('super_admin', 'hospital_admin', 'nurse'), ctrl.updateAssignment);

router.get('/vitals', protect, ctrl.listVitals);
router.post('/vitals', protect, authorize('nurse', 'doctor'), ctrl.recordVitals);

router.get('/notes', protect, ctrl.listNotes);
router.post('/notes', protect, authorize('nurse', 'doctor'), ctrl.addNote);

export default router;
