import { Router } from 'express';
import { getAvailableInterests, saveInterests, getMyInterests } from '../controllers/interest.controller';
import { protect } from '../middleware/auth';

const router = Router();

// Public — available courses for interest selection on registration form
router.get('/available', getAvailableInterests);

// Auth required — save interests
router.post('/', protect, saveInterests);

// Auth required — get my interests
router.get('/mine', protect, getMyInterests);

export default router;
