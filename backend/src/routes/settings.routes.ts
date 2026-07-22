import { Router } from 'express';
import { getSettings, updateSetting, deleteSetting } from '../controllers/settings.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', getSettings);
router.put('/', authorize('admin'), updateSetting);
router.delete('/:key', authorize('admin'), deleteSetting);

export default router;
