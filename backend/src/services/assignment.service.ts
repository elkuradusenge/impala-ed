import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export const createAssignment = async (data: {
  title: string; description?: string; instructions: string;
  courseId: string; mentorId: string; googleDocsLink?: string; dueDate?: string;
}) => {
  return prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description || '',
      instructions: data.instructions,
      courseId: data.courseId,
      mentorId: data.mentorId,
      googleDocsLink: data.googleDocsLink || '',
      ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
    },
  });
};

export const getAssignmentsByCourse = async (courseId: string) => {
  return prisma.assignment.findMany({
    where: { courseId, isActive: true },
    include: { mentor: { select: { id: true, name: true } } },
  });
};

export const getAssignmentById = async (id: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { mentor: { select: { id: true, name: true } }, course: { select: { id: true, title: true } } },
  });
  if (!assignment) throw new NotFoundError('Assignment');
  return assignment;
};

export const updateAssignment = async (id: string, data: any) => {
  const assignment = await prisma.assignment.update({ where: { id }, data });
  if (!assignment) throw new NotFoundError('Assignment');
  return assignment;
};

export const deactivateAssignment = async (id: string) => {
  const assignment = await prisma.assignment.update({ where: { id }, data: { isActive: false } });
  if (!assignment) throw new NotFoundError('Assignment');
  return assignment;
};

export const submitAssignment = async (assignmentId: string, userId: string, submittedLink: string) => {
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new NotFoundError('Assignment');

  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId: userId } },
  });

  if (existing) {
    return prisma.assignmentSubmission.update({
      where: { id: existing.id },
      data: { submittedLink, status: 'submitted', submittedAt: new Date() },
    });
  }

  return prisma.assignmentSubmission.create({
    data: {
      assignmentId,
      studentId: userId,
      courseId: assignment.courseId,
      submittedLink,
      status: 'submitted',
      submittedAt: new Date(),
    },
  });
};

export const getMySubmissions = async (userId: string) => {
  return prisma.assignmentSubmission.findMany({
    where: { studentId: userId },
    include: { assignment: { include: { course: { select: { id: true, title: true } } } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSubmissionByAssignment = async (assignmentId: string, userId: string) => {
  return prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId: userId } },
    include: { assignment: true },
  });
};

export const getAllSubmissions = async (courseId: string) => {
  return prisma.assignmentSubmission.findMany({
    where: { courseId },
    include: { student: { select: { id: true, name: true, email: true } }, assignment: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const reviewSubmission = async (id: string, data: { status: string; mentorFeedback?: string }) => {
  const submission = await prisma.assignmentSubmission.update({
    where: { id },
    data: { status: data.status as any, mentorFeedback: data.mentorFeedback || '', reviewedAt: new Date() },
  });
  if (!submission) throw new NotFoundError('Submission');
  return submission;
};
