import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as lessonService from '../services/lesson.service';
import { AuthRequest } from '../types';

export const createLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const lesson = await lessonService.createLesson(req.body);
  res.status(201).json(lesson);
});

export const getLessonsByModule = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const lessons = await lessonService.getLessonsByModule(req.params.moduleId);
  res.json(lessons);
});

export const getLessonById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const lesson = await lessonService.getLessonById(req.params.id);
  res.json(lesson);
});

export const updateLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const lesson = await lessonService.updateLesson(req.params.id, req.body);
  res.json(lesson);
});

export const deleteLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await lessonService.deleteLesson(req.params.id);
  res.json({ message: 'Lesson deleted successfully' });
});

export const completeLesson = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await lessonService.completeLesson(req.params.id, req.user!.id);
  res.json({ message: 'Lesson marked as completed', ...result });
});

export const getLessonProgress = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const progress = await lessonService.getLessonProgress(req.params.courseId, req.user!.id);
  res.json(progress);
});
