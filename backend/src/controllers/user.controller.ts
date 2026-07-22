import { Request, Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as userService from '../services/user.service';
import { AuthRequest } from '../types';

export const getUsers = asyncWrapper(async (req: Request, res: Response) => {
  const users = await userService.getUsers(req.query as any);
  res.json(users);
});

export const getUserById = asyncWrapper(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  const updated = await userService.updateUser(req.params.id, req.body);
  res.json(updated);
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  await userService.deactivateUser(req.params.id);
  res.json({ message: 'User deactivated' });
});

export const resetUserPassword = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { newPassword } = req.body;
  await userService.resetUserPassword(req.params.id, newPassword);
  res.json({ message: 'Password reset successfully' });
});

export const createStudent = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const user = await userService.createStudent(name, email, password);
  res.status(201).json({ message: 'Student created successfully', user });
});
