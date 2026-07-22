import { Router } from 'express';
import {
  createCourse, getCourses, getCourseById, updateCourse,
  deleteCourse, approveCourse, getCategories, createCategory,
  updateCategory, deleteCategory,
} from '../controllers/course.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', getCourses);
router.get('/categories/all', getCategories);
router.post('/categories', authorize('admin'), createCategory);
router.put('/categories/:id', authorize('admin'), updateCategory);
router.delete('/categories/:id', authorize('admin'), deleteCategory);
router.get('/:id', getCourseById);
router.post('/', authorize('mentor', 'admin'), createCourse);
router.put('/:id', authorize('mentor', 'admin'), updateCourse);
router.delete('/:id', authorize('mentor', 'admin'), deleteCourse);
router.put('/:id/approve', authorize('admin'), approveCourse);

export default router;
