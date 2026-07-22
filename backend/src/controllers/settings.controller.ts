import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as settingsService from '../services/settings.service';
import { AuthRequest } from '../types';

export const getSettings = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const settings = await settingsService.getSettings();
  res.json(settings);
});

export const updateSetting = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { key, value, description } = req.body;
  const setting = await settingsService.updateSetting(key, value, description, req.user!.id);
  res.json(setting);
});

export const deleteSetting = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await settingsService.deleteSetting(req.params.key);
  res.json({ message: 'Setting deleted' });
});
