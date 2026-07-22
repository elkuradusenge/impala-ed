import { Router } from 'express';
import { getStudentProgressByMentor, getStudentsNotCompleted } from '../controllers/progress.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/course/:courseId', authorize('mentor', 'admin'), getStudentProgressByMentor);
router.get('/course/:courseId/incomplete', authorize('mentor', 'admin'), getStudentsNotCompleted);

export default router;
