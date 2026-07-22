import { Router } from 'express';
import {
  createModule, getModulesByCourse, getModuleById,
  updateModule, deleteModule, reorderModules,
} from '../controllers/module.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/course/:courseId', getModulesByCourse);
router.get('/:id', getModuleById);
router.post('/', authorize('mentor', 'admin'), createModule);
router.put('/reorder', authorize('mentor', 'admin'), reorderModules);
router.put('/:id', authorize('mentor', 'admin'), updateModule);
router.delete('/:id', authorize('mentor', 'admin'), deleteModule);

export default router;
