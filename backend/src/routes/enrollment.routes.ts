import { Router } from 'express';
import {
  enrollCourse, unenrollCourse, getEnrolledCourses,
  checkEnrollment, getStudentProgress,
} from '../controllers/enrollment.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.post('/:courseId', enrollCourse);
router.delete('/:courseId', unenrollCourse);
router.get('/', getEnrolledCourses);
router.get('/check/:courseId', checkEnrollment);
router.get('/progress/:studentId/:courseId', authorize('mentor', 'admin'), getStudentProgress);

export default router;
