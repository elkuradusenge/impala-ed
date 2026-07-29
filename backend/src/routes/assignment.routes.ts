import { Router } from 'express';
import {
  createAssignment, getAssignmentsByCourse, getAssignmentById,
  updateAssignment, togglePublishAssignment, deleteAssignment,
  startAttempt, saveAnswer, submitAttempt, getAttemptById, getMyAttempts,
  getAllSubmissions, reviewSubmission,
} from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

// Teacher routes
router.post('/', authorize('mentor', 'admin'), createAssignment);
router.put('/:id', authorize('mentor', 'admin'), updateAssignment);
router.put('/:id/publish', authorize('mentor', 'admin'), togglePublishAssignment);
router.delete('/:id', authorize('mentor', 'admin'), deleteAssignment);
router.get('/submissions/:courseId', authorize('mentor', 'admin'), getAllSubmissions);
router.put('/submissions/:id/review', authorize('mentor', 'admin'), reviewSubmission);

// Shared routes
router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/:id', getAssignmentById);

// Student routes
router.post('/:id/start', startAttempt);
router.post('/attempts/:attemptId/answer', saveAnswer);
router.post('/attempts/:attemptId/submit', submitAttempt);
router.get('/attempts/:attemptId', getAttemptById);
router.get('/:assignmentId/my-attempts', getMyAttempts);

export default router;
