import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import fs from 'fs';

export const uploadPDF = async (data: {
  title: string; fileName: string; originalName: string;
  filePath: string; fileSize: number; uploadedById: string;
  courseId?: string;
}) => {
  const createData: any = {
    title: data.title,
    fileName: data.fileName,
    originalName: data.originalName,
    filePath: data.filePath,
    fileSize: data.fileSize,
    uploadedById: data.uploadedById,
  };
  if (data.courseId) {
    createData.courseId = data.courseId;
  }
  return prisma.pdfDocument.create({ data: createData });
};

export const getPDFs = async () => {
  return prisma.pdfDocument.findMany({
    include: { uploadedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPDFById = async (id: string) => {
  const pdf = await prisma.pdfDocument.findUnique({ where: { id } });
  if (!pdf) throw new NotFoundError('PDF');
  return pdf;
};

export const getPDFFilePath = async (id: string) => {
  const pdf = await prisma.pdfDocument.findUnique({ where: { id } });
  if (!pdf) throw new NotFoundError('PDF');

  const filePath = pdf.filePath as string;
  if (!fs.existsSync(filePath)) throw new NotFoundError('PDF file on server');

  return { filePath, originalName: pdf.originalName };
};

export const deletePDF = async (id: string) => {
  const pdf = await prisma.pdfDocument.findUnique({ where: { id } });
  if (!pdf) throw new NotFoundError('PDF');

  try { fs.unlinkSync(pdf.filePath); } catch (_) { /* file may already be deleted */ }
  await prisma.pdfDocument.delete({ where: { id } });
};
