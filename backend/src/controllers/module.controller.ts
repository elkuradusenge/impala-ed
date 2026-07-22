import { Request, Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as moduleService from '../services/module.service';

export const createModule = asyncWrapper(async (req: Request, res: Response) => {
  const mod = await moduleService.createModule(req.body);
  res.status(201).json(mod);
});

export const getModulesByCourse = asyncWrapper(async (req: Request, res: Response) => {
  const modules = await moduleService.getModulesByCourse(req.params.courseId);
  res.json(modules);
});

export const getModuleById = asyncWrapper(async (req: Request, res: Response) => {
  const mod = await moduleService.getModuleById(req.params.id);
  res.json(mod);
});

export const updateModule = asyncWrapper(async (req: Request, res: Response) => {
  const mod = await moduleService.updateModule(req.params.id, req.body);
  res.json(mod);
});

export const deleteModule = asyncWrapper(async (req: Request, res: Response) => {
  await moduleService.deleteModule(req.params.id);
  res.json({ message: 'Module deleted successfully' });
});

export const reorderModules = asyncWrapper(async (req: Request, res: Response) => {
  await moduleService.reorderModules(req.body.modules);
  res.json({ message: 'Modules reordered' });
});
