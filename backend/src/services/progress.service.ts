import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export const getStudentProgressByMentor = async (courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course');

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId },
    include: {
      student: { select: { id: true, name: true, email: true, profilePicture: true } },
    },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId } });

  return Promise.all(
    enrollments.map(async (enrollment) => {
      const submissions = await prisma.assignmentSubmission.findMany({
        where: { studentId: enrollment.studentId, courseId },
        include: { assignment: { select: { id: true, title: true } } },
      });

      return {
        student: enrollment.student,
        completedLessons: enrollment.completedLessons.length,
        totalLessons,
        percentage: totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0,
        completed: enrollment.completed,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        assignments: submissions,
      };
    })
  );
};

export const getStudentsNotCompleted = async (courseId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId, completed: false },
    include: { student: { select: { id: true, name: true, email: true } } },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId } });

  return enrollments.map((enrollment) => ({
    id: enrollment.student.id,
    name: enrollment.student.name,
    email: enrollment.student.email,
    completedLessons: enrollment.completedLessons.length,
    totalLessons,
    percentage: totalLessons > 0 ? Math.round((enrollment.completedLessons.length / totalLessons) * 100) : 0,
  }));
};
