import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const enrollCourse = async (courseId: string, userId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course');
  if (!course.isPublished) throw new BadRequestError('Course is not available for enrollment');

  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId } },
  });
  if (existing) throw new BadRequestError('Already enrolled in this course');

  await prisma.enrollment.create({
    data: { studentId: userId, courseId },
  });

  await prisma.course.update({ where: { id: courseId }, data: { enrollmentCount: { increment: 1 } } });

  return { message: 'Enrolled successfully' };
};

export const unenrollCourse = async (courseId: string, userId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId } },
  });
  if (!enrollment) throw new NotFoundError('Enrollment');

  await prisma.enrollment.delete({ where: { id: enrollment.id } });
  await prisma.course.update({ where: { id: courseId }, data: { enrollmentCount: { decrement: 1 } } });
};

export const getEnrolledCourses = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: {
      course: {
        include: { mentor: { select: { id: true, name: true, email: true, profilePicture: true } } },
      },
    },
  });

  return enrollments.map((e) => ({
    ...e.course,
    enrolledAt: e.enrolledAt,
    completedLessons: e.completedLessons,
    currentLesson: e.currentLessonId,
    completed: e.completed,
    completedAt: e.completedAt,
    enrollmentId: e.id,
  }));
};

export const checkEnrollment = async (courseId: string, userId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId: userId, courseId } },
  });
  return { enrolled: !!enrollment };
};

export const getStudentProgress = async (studentId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } },
    include: { course: { select: { id: true, title: true } }, student: { select: { id: true, name: true, email: true } } },
  });
  if (!enrollment) throw new NotFoundError('Enrollment');

  const totalLessons = await prisma.lesson.count({ where: { courseId } });

  return {
    student: enrollment.student,
    course: enrollment.course,
    completedLessons: enrollment.completedLessons.length,
    totalLessons,
    percentage: totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0,
    completed: enrollment.completed,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt,
  };
};
