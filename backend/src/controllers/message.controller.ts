import { Response } from 'express';
import asyncWrapper from '../utils/asyncWrapper';
import * as messageService from '../services/message.service';
import { AuthRequest } from '../types';

export const sendMessage = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const message = await messageService.sendMessage({
    senderId: req.user!.id,
    receiverId: req.body.receiver,
    subject: req.body.subject,
    content: req.body.content,
    senderName: req.user!.name,
  });
  res.status(201).json(message);
});

export const getConversations = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const conversations = await messageService.getConversations(req.user!.id);
  res.json(conversations);
});

export const getMessages = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const messages = await messageService.getMessages(req.user!.id, req.params.userId);
  res.json(messages);
});

export const deleteMessage = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await messageService.deleteMessage(req.params.id, req.user!.id);
  res.json({ message: 'Message deleted' });
});

export const getUnreadCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const result = await messageService.getUnreadCount(req.user!.id);
  res.json(result);
});
