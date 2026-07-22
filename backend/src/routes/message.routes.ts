import { Router } from 'express';
import { sendMessage, getConversations, getMessages, deleteMessage, getUnreadCount } from '../controllers/message.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/conversations', getConversations);
router.get('/unread', getUnreadCount);
router.get('/:userId', getMessages);
router.post('/', sendMessage);
router.delete('/:id', deleteMessage);

export default router;
