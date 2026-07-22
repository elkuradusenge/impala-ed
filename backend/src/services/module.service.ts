import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export const createModule = async (data: { courseId: string; title: string; description?: string; order?: number }) => {
  const course = await prisma.course.findUnique({ where: { id: data.courseId } });
  if (!course) throw new NotFoundError('Course');

  const moduleOrder = data.order ?? (await prisma.module.count({ where: { courseId: data.courseId } })) + 1;

  return prisma.module.create({
    data: { title: data.title, description: data.description || '', courseId: data.courseId, order: moduleOrder },
  });
};

export const getModulesByCourse = async (courseId: string) => {
  return prisma.module.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { pdfDocument: { select: { id: true, title: true, fileName: true, fileSize: true } } },
      },
    },
  });
};

export const getModuleById = async (id: string) => {
  const mod = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        include: { pdfDocument: true },
      },
    },
  });
  if (!mod) throw new NotFoundError('Module');
  return mod;
};

export const updateModule = async (id: string, data: { title?: string; description?: string; order?: number }) => {
  const mod = await prisma.module.update({ where: { id }, data });
  if (!mod) throw new NotFoundError('Module');
  return mod;
};

export const deleteModule = async (id: string) => {
  const mod = await prisma.module.findUnique({ where: { id } });
  if (!mod) throw new NotFoundError('Module');

  await prisma.lesson.deleteMany({ where: { moduleId: id } });
  await prisma.module.delete({ where: { id } });
};

export const reorderModules = async (moduleIds: string[]) => {
  for (let i = 0; i < moduleIds.length; i++) {
    await prisma.module.update({ where: { id: moduleIds[i] }, data: { order: i + 1 } });
  }
};
