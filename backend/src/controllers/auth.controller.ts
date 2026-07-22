import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../types';

export const register = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;
  const result = await authService.registerUser(name, email, password, role);
  res.status(201).json(result);
});

export const login = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});

export const getProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const profile = await authService.getProfile(req.user!.id);
  res.json(profile);
});

export const updateProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { name, bio, profilePicture } = req.body;
  const updated = await authService.updateProfile(req.user!.id, { name, bio, profilePicture });
  res.json(updated);
});

export const changePassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.id, currentPassword, newPassword);
  res.json({ message: 'Password updated successfully' });
});

export const forgotPassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  const resetToken = await authService.forgotPassword(email);
  res.json({ message: 'Password reset link sent to email', resetToken });
});

export const resetPassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { password } = req.body;
  await authService.resetPassword(req.params.token, password);
  res.json({ message: 'Password reset successful' });
});
