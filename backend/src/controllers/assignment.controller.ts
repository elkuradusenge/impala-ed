import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as assignmentService from '../services/assignment.service';
import { AuthRequest } from '../types';

export const createAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignment = await assignmentService.createAssignment({ ...req.body, mentorId: req.user!.id });
  res.status(201).json(assignment);
});

export const getAssignmentsByCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignments = await assignmentService.getAssignmentsByCourse(req.params.courseId);
  res.json(assignments);
});

export const getAssignmentById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignment = await assignmentService.getAssignmentById(req.params.id);
  res.json(assignment);
});

export const updateAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
  res.json(assignment);
});

export const togglePublishAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignment = await assignmentService.togglePublishAssignment(req.params.id, req.body.isPublished);
  res.json(assignment);
});

export const deleteAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await assignmentService.deactivateAssignment(req.params.id);
  res.json({ message: 'Assignment deactivated' });
});

export const startAttempt = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const attempt = await assignmentService.startAttempt(req.params.id, req.user!.id);
  res.json(attempt);
});

export const saveAnswer = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { questionId, answer, selectedOptionId } = req.body;
  const result = await assignmentService.saveAnswer(req.params.attemptId, questionId, req.user!.id, answer, selectedOptionId);
  res.json(result);
});

export const submitAttempt = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await assignmentService.submitAttempt(req.params.attemptId, req.user!.id);
  res.json(result);
});

export const getAttemptById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const attempt = await assignmentService.getAttemptById(req.params.attemptId, req.user!.id);
  res.json(attempt);
});

export const getMyAttempts = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const attempts = await assignmentService.getMyAttempts(req.params.assignmentId, req.user!.id);
  res.json(attempts);
});

export const getAllSubmissions = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const submissions = await assignmentService.getAllSubmissions(req.params.courseId);
  res.json(submissions);
});

export const reviewSubmission = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { status, mentorFeedback } = req.body;
  const submission = await assignmentService.reviewSubmission(req.params.id, { status, mentorFeedback });
  res.json(submission);
});
