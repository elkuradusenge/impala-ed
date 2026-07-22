import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as assignmentService from '../services/assignment.service';
import { AuthRequest } from '../types';

export const createAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const assignment = await assignmentService.createAssignment({
    ...req.body,
    mentorId: req.user!.id,
  });
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

export const deleteAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await assignmentService.deactivateAssignment(req.params.id);
  res.json({ message: 'Assignment deactivated' });
});

export const submitAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { submittedLink } = req.body;
  const submission = await assignmentService.submitAssignment(req.params.id, req.user!.id, submittedLink);
  res.json(submission);
});

export const getMySubmissions = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const submissions = await assignmentService.getMySubmissions(req.user!.id);
  res.json(submissions);
});

export const getSubmissionByAssignment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const submission = await assignmentService.getSubmissionByAssignment(req.params.assignmentId, req.user!.id);
  res.json(submission);
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
