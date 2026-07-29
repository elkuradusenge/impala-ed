import prisma from '../config/database';

/**
 * Get all approved & published courses available for interest selection.
 * This is a public endpoint — no auth required.
 */
export const getAvailableCourseInterests = async () => {
  return prisma.course.findMany({
    where: {
      isPublished: true,
      isApproved: true,
      isArchived: false,
    },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      category: { select: { id: true, name: true } },
      difficultyLevel: true,
    },
    orderBy: { title: 'asc' },
  });
};

/**
 * Save a user's course interests (called after registration or from profile).
 */
export const saveCourseInterests = async (userId: string, courseIds: string[]) => {
  // Verify all courses exist
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds }, isApproved: true, isArchived: false },
  });

  if (courses.length !== courseIds.length) {
    throw new Error('One or more selected courses are invalid');
  }

  // Delete existing interests for this user, then create new ones
  await prisma.courseInterest.deleteMany({ where: { userId } });

  if (courseIds.length > 0) {
    await prisma.courseInterest.createMany({
      data: courseIds.map((courseId) => ({ userId, courseId })),
    });
  }

  return getCourseInterests(userId);
};

/**
 * Get a user's saved course interests.
 */
export const getCourseInterests = async (userId: string) => {
  return prisma.courseInterest.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          shortDescription: true,
          category: { select: { id: true, name: true } },
          difficultyLevel: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
