import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';
import { slugify } from '../utils/formatters';

export const createCourse = async (data: any, mentorId: string) => {
  const course = await prisma.course.create({
    data: {
      ...data,
      mentorId,
      slug: slugify(data.title),
      learningObjectives: data.learningObjectives || [],
    },
  });
  return prisma.course.findUnique({
    where: { id: course.id },
    include: { mentor: { select: { id: true, name: true, email: true } }, category: true },
  });
};

export const getCourses = async (query: any, userRole?: string) => {
  const where: any = {};

  if (query.category) where.categoryId = query.category;
  if (query.difficulty) where.difficultyLevel = query.difficulty;
  if (query.mentor) where.mentorId = query.mentor;
  if (query.isPublished !== undefined) where.isPublished = query.isPublished === 'true';
  if (query.isArchived !== undefined) where.isArchived = query.isArchived === 'true';

  if (userRole === 'student') {
    where.isPublished = true;
    where.isApproved = true;
    where.isArchived = false;
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return prisma.course.findMany({
    where,
    include: {
      mentor: { select: { id: true, name: true, email: true, profilePicture: true } },
      category: true,
      modules: { include: { lessons: { include: { pdfDocument: { select: { id: true, title: true, fileName: true } } } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      mentor: { select: { id: true, name: true, email: true, profilePicture: true, bio: true } },
      category: true,
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: { pdfDocument: { select: { id: true, title: true, fileName: true, originalName: true } } },
          },
        },
      },
    },
  });
  if (!course) throw new NotFoundError('Course');
  return course;
};

export const updateCourse = async (id: string, data: any) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundError('Course');

  if (data.title) data.slug = slugify(data.title);

  return prisma.course.update({ where: { id }, data });
};

export const archiveCourse = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new NotFoundError('Course');

  return prisma.course.update({ where: { id }, data: { isArchived: true } });
};

export const approveCourse = async (id: string) => {
  const course = await prisma.course.update({
    where: { id },
    data: { isApproved: true, isPublished: true },
  });
  if (!course) throw new NotFoundError('Course');
  return course;
};

export const getCategories = async () => {
  return prisma.courseCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
};

export const createCategory = async (data: { name: string; description?: string }) => {
  return prisma.courseCategory.create({ data });
};

export const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
  const category = await prisma.courseCategory.update({ where: { id }, data });
  if (!category) throw new NotFoundError('Category');
  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.courseCategory.update({ where: { id }, data: { isActive: false } });
  if (!category) throw new NotFoundError('Category');
  return category;
};
