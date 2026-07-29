import { Router } from 'express';
import {
  createCourse, getCourses, getCourseById, updateCourse,
  deleteCourse, approveCourse, getCategories, createCategory,
  updateCategory, deleteCategory,
} from '../controllers/course.controller';
import { protect, authorize, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes — no auth required, but optionalAuth sets req.user if token present
router.get('/', optionalAuth, getCourses);
router.get('/categories/all', optionalAuth, getCategories);
router.get('/:id', optionalAuth, getCourseById);

// Protected routes — auth required
router.post('/categories', protect, authorize('admin'), createCategory);
router.put('/categories/:id', protect, authorize('admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);
router.post('/', protect, authorize('mentor', 'admin'), createCourse);
router.put('/:id', protect, authorize('mentor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteCourse);
router.put('/:id/approve', protect, authorize('admin'), approveCourse);

export default router;
