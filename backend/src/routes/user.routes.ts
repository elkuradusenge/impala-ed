import { Router } from 'express';
import {
  getUsers, getUserById, updateUser, deleteUser,
  resetUserPassword, createStudent,
} from '../controllers/user.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', authorize('admin'), getUsers);
router.post('/create-student', authorize('admin'), createStudent);
router.get('/:id', getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/reset-password', authorize('admin'), resetUserPassword);

export default router;
