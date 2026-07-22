import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as dashboardService from '../services/dashboard.service';
import { AuthRequest } from '../types';

export const getStudentDashboard = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const data = await dashboardService.getStudentDashboard(req.user!.id);
  res.json(data);
});

export const getMentorDashboard = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const data = await dashboardService.getMentorDashboard(req.user!.id);
  res.json(data);
});

export const getAdminDashboard = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const data = await dashboardService.getAdminDashboard();
  res.json(data);
});
