import { Request, Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as progressService from '../services/progress.service';

export const getStudentProgressByMentor = asyncWrapper(async (req: Request, res: Response) => {
  const progress = await progressService.getStudentProgressByMentor(req.params.courseId);
  res.json(progress);
});

export const getStudentsNotCompleted = asyncWrapper(async (req: Request, res: Response) => {
  const students = await progressService.getStudentsNotCompleted(req.params.courseId);
  res.json(students);
});
