import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export const createLesson = async (data: {
  title: string; description?: string; moduleId: string; courseId: string;
  order?: number; pdfDocumentId?: string; duration?: string;
}) => {
  const lessonOrder = data.order ?? (await prisma.lesson.count({ where: { moduleId: data.moduleId } })) + 1;

  return prisma.lesson.create({
    data: {
      title: data.title,
      description: data.description || '',
      moduleId: data.moduleId,
      courseId: data.courseId,
      order: lessonOrder,
      pdfDocumentId: data.pdfDocumentId,
      duration: data.duration || '',
    },
  });
};

export const getLessonsByModule = async (moduleId: string) => {
  return prisma.lesson.findMany({
    where: { moduleId },
    orderBy: { order: 'asc' },
    include: { pdfDocument: { select: { id: true, title: true, fileName: true, fileSize: true, originalName: true } } },
  });
};

export const getLessonById = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { pdfDocument: true, module: { select: { id: true, title: true, order: true } }, course: { select: { id: true, title: true } } },
  });
  if (!lesson) throw new NotFoundError('Lesson');
  return lesson;
};

export const updateLesson = async (id: string, data: any) => {
  const lesson = await prisma.lesson.update({ where: { id }, data });
  if (!lesson) throw new NotFoundError('Lesson');
  return lesson;
};

export const deleteLesson = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new NotFoundError('Lesson');

  await prisma.lesson.delete({ where: { id } });
};

export const completeLesson = async (lessonId: string, userId: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new NotFoundError('Lesson');

  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId: lesson.courseId } },
  });
  if (!enrollment) throw new NotFoundError('Enrollment');

  const completedLessons = enrollment.completedLessons.includes(lessonId)
    ? enrollment.completedLessons
    : [...enrollment.completedLessons, lessonId];

  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
  const allCompleted = completedLessons.length >= totalLessons;

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      completedLessons,
      currentLessonId: lessonId,
      ...(allCompleted ? { completed: true, completedAt: new Date() } : {}),
    },
  });

  return { completed: allCompleted, completedLessons: completedLessons.length, totalLessons };
};

export const getLessonProgress = async (courseId: string, userId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId } },
  });
  if (!enrollment) throw new NotFoundError('Enrollment');

  const totalLessons = await prisma.lesson.count({ where: { courseId } });

  let currentLesson = null;
  if (enrollment.currentLessonId) {
    currentLesson = await prisma.lesson.findUnique({ where: { id: enrollment.currentLessonId } });
  }

  return {
    completedLessons: enrollment.completedLessons,
    currentLesson,
    totalLessons,
    completedCount: enrollment.completedLessons.length,
    percentage: totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0,
    completed: enrollment.completed,
  };
};
