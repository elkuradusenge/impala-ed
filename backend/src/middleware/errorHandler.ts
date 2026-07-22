import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found' });
  }

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
