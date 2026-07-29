import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as interestService from '../services/interest.service';
import { AuthRequest } from '../types';

/**
 * Public — get all available courses for interest selection during registration.
 */
export const getAvailableInterests = asyncWrapper(async (_req: AuthRequest, res: Response) => {
  const courses = await interestService.getAvailableCourseInterests();
  res.json(courses);
});

/**
 * Save user's course interests (auth required).
 */
export const saveInterests = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { courseIds } = req.body;
  if (!Array.isArray(courseIds)) {
    res.status(400).json({ message: 'courseIds must be an array' });
    return;
  }
  const interests = await interestService.saveCourseInterests(req.user!.id, courseIds);
  res.status(201).json(interests);
});

/**
 * Get current user's saved interests (auth required).
 */
export const getMyInterests = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const interests = await interestService.getCourseInterests(req.user!.id);
  res.json(interests);
});
