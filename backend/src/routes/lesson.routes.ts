import { Router } from 'express';
import {
  createLesson, getLessonsByModule, getLessonById,
  updateLesson, deleteLesson, completeLesson, getLessonProgress,
} from '../controllers/lesson.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/module/:moduleId', getLessonsByModule);
router.get('/progress/:courseId', getLessonProgress);
router.get('/:id', getLessonById);
router.post('/', authorize('mentor', 'admin'), createLesson);
router.put('/:id', authorize('mentor', 'admin'), updateLesson);
router.delete('/:id', authorize('mentor', 'admin'), deleteLesson);
router.put('/:id/complete', completeLesson);

export default router;
