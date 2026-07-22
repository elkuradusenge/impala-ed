import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as enrollmentService from '../services/enrollment.service';
import { AuthRequest } from '../types';

export const enrollCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await enrollmentService.enrollCourse(req.params.courseId, req.user!.id);
  res.json(result);
});

export const unenrollCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await enrollmentService.unenrollCourse(req.params.courseId, req.user!.id);
  res.json({ message: 'Unenrolled successfully' });
});

export const getEnrolledCourses = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const courses = await enrollmentService.getEnrolledCourses(req.user!.id);
  res.json(courses);
});

export const checkEnrollment = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await enrollmentService.checkEnrollment(req.params.courseId, req.user!.id);
  res.json(result);
});

export const getStudentProgress = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const progress = await enrollmentService.getStudentProgress(req.params.studentId, req.params.courseId);
  res.json(progress);
});
