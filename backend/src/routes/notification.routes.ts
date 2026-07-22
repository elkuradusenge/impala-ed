import { Router } from 'express';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount, deleteNotification } from '../controllers/notification.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
