import prisma from '../config/database';

export const getStudentDashboard = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId: userId },
    include: {
      course: { select: { id: true, title: true, slug: true, thumbnail: true, difficultyLevel: true } },
    },
  });

  const activeEnrollments = enrollments.filter((e) => !e.completed);
  const completedEnrollments = enrollments.filter((e) => e.completed);

  let totalLessons = 0;
  let totalCompleted = 0;

  for (const enrollment of enrollments) {
    const count = await prisma.lesson.count({ where: { courseId: enrollment.courseId } });
    totalLessons += count;
    totalCompleted += enrollment.completedLessons.length;
  }

  const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: userId },
  });

  const pendingAssignments = submissions.filter((s) => s.status === 'submitted').length;
  const reviewedAssignments = submissions.filter((s) => s.status === 'reviewed').length;

  const unreadMessages = await prisma.message.count({
    where: { receiverId: userId, isRead: false, isDeletedByReceiver: false },
  });

  return {
    activeEnrollments: activeEnrollments.length,
    completedCourses: completedEnrollments.length,
    overallProgress,
    totalLessons,
    totalCompleted,
    pendingAssignments,
    reviewedAssignments,
    unreadMessages,
    recentCourses: enrollments.slice(-5).reverse(),
  };
};

export const getMentorDashboard = async (userId: string) => {
  const courses = await prisma.course.findMany({ where: { mentorId: userId } });
  const courseIds = courses.map((c) => c.id);

  const totalStudents = await prisma.enrollment.groupBy({
    by: ['studentId'],
    where: { courseId: { in: courseIds } },
  });

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: { in: courseIds } },
  });

  const completedEnrollments = enrollments.filter((e) => e.completed);

  const totalAssignments = await prisma.assignment.count({
    where: { courseId: { in: courseIds } },
  });

  const pendingReviews = await prisma.assignmentSubmission.count({
    where: { courseId: { in: courseIds }, status: 'submitted' },
  });

  const unreadMessages = await prisma.message.count({
    where: { receiverId: userId, isRead: false, isDeletedByReceiver: false },
  });

  return {
    totalCourses: courses.length,
    publishedCourses: courses.filter((c) => c.isPublished).length,
    totalStudents: totalStudents.length,
    totalEnrollments: enrollments.length,
    completedEnrollments: completedEnrollments.length,
    totalAssignments,
    pendingReviews,
    unreadMessages,
  };
};

export const getAdminDashboard = async () => {
  const [totalUsers, totalStudents, totalMentors, totalCourses, publishedCourses, totalAssignments] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'mentor' } }),
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.assignment.count(),
    ]);

  const enrollments = await prisma.enrollment.findMany();
  const activeEnrollments = enrollments.filter((e) => !e.completed);
  const completedCourses = enrollments.filter((e) => e.completed);

  return {
    totalUsers,
    totalStudents,
    totalMentors,
    totalCourses,
    publishedCourses,
    activeEnrollments: activeEnrollments.length,
    completedCourses: completedCourses.length,
    totalAssignments,
  };
};
