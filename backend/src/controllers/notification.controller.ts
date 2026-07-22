import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as notificationService from '../services/notification.service';
import { AuthRequest } from '../types';

export const getNotifications = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const notifications = await notificationService.getNotifications(req.user!.id);
  res.json(notifications);
});

export const markAsRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user!.id);
  res.json(notification);
});

export const markAllAsRead = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await notificationService.markAllAsRead(req.user!.id);
  res.json({ message: 'All notifications marked as read' });
});

export const getUnreadCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await notificationService.getUnreadCount(req.user!.id);
  res.json(result);
});

export const deleteNotification = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await notificationService.deleteNotification(req.params.id, req.user!.id);
  res.json({ message: 'Notification deleted' });
});
