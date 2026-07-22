import { Router } from 'express';
import {
  createAssignment, getAssignmentsByCourse, getAssignmentById,
  updateAssignment, deleteAssignment, submitAssignment,
  getMySubmissions, getSubmissionByAssignment, getAllSubmissions, reviewSubmission,
} from '../controllers/assignment.controller';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.get('/my-submissions', getMySubmissions);
router.get('/my-submission/:assignmentId', getSubmissionByAssignment);
router.post('/:id/submit', submitAssignment);
router.post('/', authorize('mentor', 'admin'), createAssignment);
router.put('/:id', authorize('mentor', 'admin'), updateAssignment);
router.delete('/:id', authorize('mentor', 'admin'), deleteAssignment);
router.put('/submissions/:id/review', authorize('mentor', 'admin'), reviewSubmission);
router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/submissions/:courseId', authorize('mentor', 'admin'), getAllSubmissions);
router.get('/:id', getAssignmentById);

export default router;
