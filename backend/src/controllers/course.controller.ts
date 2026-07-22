import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as courseService from '../services/course.service';
import { AuthRequest } from '../types';

export const createCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const mentorId = req.user!.role === 'mentor' ? req.user!.id : req.body.mentor;
  const course = await courseService.createCourse(req.body, mentorId);
  res.status(201).json(course);
});

export const getCourses = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const userRole = req.user?.role;
  const courses = await courseService.getCourses(req.query, userRole);
  res.json(courses);
});

export const getCourseById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const course = await courseService.getCourseById(req.params.id);
  res.json(course);
});

export const updateCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.json(course);
});

export const deleteCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await courseService.archiveCourse(req.params.id);
  res.json({ message: 'Course archived' });
});

export const approveCourse = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const course = await courseService.approveCourse(req.params.id);
  res.json(course);
});

export const getCategories = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const categories = await courseService.getCategories();
  res.json(categories);
});

export const createCategory = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const category = await courseService.createCategory(req.body);
  res.status(201).json(category);
});

export const updateCategory = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const category = await courseService.updateCategory(req.params.id, req.body);
  res.json(category);
});

export const deleteCategory = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await courseService.deleteCategory(req.params.id);
  res.json({ message: 'Category deactivated' });
});
