import { Response } from 'express';
import path from 'path';
import asyncWrapper from '../utils/asyncWrapper';
import * as pdfService from '../services/pdf.service';
import { AuthRequest } from '../types';

export const uploadPDF = asyncWrapper(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No PDF file uploaded' });
  }
  const pdf = await pdfService.uploadPDF({
    title: req.body.title || req.file.originalname,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    uploadedById: req.user!.id,
    courseId: req.body.courseId || undefined,
  });
  res.status(201).json(pdf);
});

export const getPDFs = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const pdfs = await pdfService.getPDFs();
  res.json(pdfs);
});

export const getPDFById = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const pdf = await pdfService.getPDFById(req.params.id);
  res.json(pdf);
});

export const servePDF = asyncWrapper(async (req: AuthRequest, res: Response) => {
  const { filePath, originalName } = await pdfService.getPDFFilePath(req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
  res.sendFile(path.resolve(filePath));
});

export const deletePDF = asyncWrapper(async (req: AuthRequest, res: Response) => {
  await pdfService.deletePDF(req.params.id);
  res.json({ message: 'PDF deleted successfully' });
});
