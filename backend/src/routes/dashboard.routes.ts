import { Router } from 'express';
import { getStudentDashboard, getMentorDashboard, getAdminDashboard } from '../controllers/dashboard.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/student', authorize('student'), getStudentDashboard);
router.get('/mentor', authorize('mentor'), getMentorDashboard);
router.get('/admin', authorize('admin'), getAdminDashboard);

export default router;
