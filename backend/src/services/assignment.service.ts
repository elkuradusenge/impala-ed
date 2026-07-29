import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const createAssignment = async (data: {
  title: string; description?: string; courseId: string; mentorId: string;
  passingScore?: number; timeLimit?: number; dueDate?: string; maxAttempts?: number;
  shuffleQuestions?: boolean; shuffleOptions?: boolean;
  showCorrectAnswers?: boolean; showExplanations?: boolean;
  questions?: {
    questionText: string; questionType?: string; points?: number;
    explanation?: string; orderIndex?: number;
    options?: { optionText: string; isCorrect: boolean }[];
  }[];
}) => {
  const { questions, ...assignmentData } = data;
  let totalPoints = 0;
  if (questions) totalPoints = questions.reduce((s, q) => s + (q.points || 5), 0);

  return prisma.assignment.create({
    data: {
      title: assignmentData.title,
      description: assignmentData.description || '',
      courseId: assignmentData.courseId,
      mentorId: assignmentData.mentorId,
      totalPoints,
      passingScore: assignmentData.passingScore ?? 50,
      timeLimit: assignmentData.timeLimit || null,
      dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate) : null,
      maxAttempts: assignmentData.maxAttempts ?? 1,
      shuffleQuestions: assignmentData.shuffleQuestions ?? false,
      shuffleOptions: assignmentData.shuffleOptions ?? false,
      showCorrectAnswers: assignmentData.showCorrectAnswers ?? true,
      showExplanations: assignmentData.showExplanations ?? true,
      ...(questions && questions.length > 0
        ? {
            questions: {
              create: questions.map((q, qi) => ({
                questionText: q.questionText,
                questionType: q.questionType || 'text',
                points: q.points || 5,
                explanation: q.explanation || '',
                orderIndex: q.orderIndex ?? qi,
                ...(q.options && q.options.length > 0
                  ? { options: { create: q.options.map((o, oi) => ({ optionText: o.optionText, isCorrect: o.isCorrect, orderIndex: oi })) } }
                  : {}),
              })),
            },
          }
        : {}),
    },
    include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } },
  });
};

export const getAssignmentsByCourse = async (courseId: string) => {
  return prisma.assignment.findMany({
    where: { courseId, isActive: true },
    include: {
      mentor: { select: { id: true, name: true } },
      questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } },
    },
  });
};

export const getAssignmentById = async (id: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      mentor: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } },
      questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } },
    },
  });
  if (!assignment) throw new NotFoundError('Assignment');
  return assignment;
};

export const updateAssignment = async (id: string, data: any) => {
  const { questions, ...updateData } = data;
  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) throw new NotFoundError('Assignment');

  await prisma.assignment.update({ where: { id }, data: updateData });

  if (questions && Array.isArray(questions)) {
    await prisma.assignmentQuestion.deleteMany({ where: { assignmentId: id } });
    let totalPoints = 0;
    for (let qi = 0; qi < questions.length; qi++) {
      const q = questions[qi];
      const pts = q.points || 5;
      totalPoints += pts;
      await prisma.assignmentQuestion.create({
        data: {
          assignmentId: id,
          questionText: q.questionText,
          questionType: q.questionType || 'text',
          points: pts,
          explanation: q.explanation || '',
          orderIndex: q.orderIndex ?? qi,
          options: q.options?.length > 0
            ? { create: q.options.map((o: any, oi: number) => ({ optionText: o.optionText, isCorrect: o.isCorrect, orderIndex: oi })) }
            : undefined,
        },
      });
    }
    await prisma.assignment.update({ where: { id }, data: { totalPoints } });
  }

  return prisma.assignment.findUnique({
    where: { id },
    include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } },
  });
};

export const togglePublishAssignment = async (id: string, isPublished: boolean) => {
  const a = await prisma.assignment.findUnique({ where: { id } });
  if (!a) throw new NotFoundError('Assignment');
  return prisma.assignment.update({ where: { id }, data: { isPublished } });
};

export const deactivateAssignment = async (id: string) => {
  const a = await prisma.assignment.findUnique({ where: { id } });
  if (!a) throw new NotFoundError('Assignment');
  return prisma.assignment.update({ where: { id }, data: { isActive: false } });
};

export const startAttempt = async (assignmentId: string, studentId: string) => {
  const asst = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!asst) throw new NotFoundError('Assignment');
  if (!asst.isPublished) throw new BadRequestError('Assignment is not published');

  const prev = await prisma.assignmentAttempt.count({ where: { assignmentId, studentId, status: 'submitted' } });
  if (prev >= asst.maxAttempts) throw new BadRequestError('Maximum attempts reached');

  const existing = await prisma.assignmentAttempt.findFirst({
    where: { assignmentId, studentId, status: 'in_progress' },
    include: { answers: true, assignment: { include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } } } },
  });
  if (existing) return existing;

  return prisma.assignmentAttempt.create({
    data: { studentId, assignmentId, attemptNumber: prev + 1 },
    include: { answers: true, assignment: { include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } } } },
  });
};

export const saveAnswer = async (attemptId: string, questionId: string, studentId: string, answer: string, selectedOptionId?: string | null) => {
  const attempt = await prisma.assignmentAttempt.findUnique({ where: { id: attemptId } });
  if (!attempt) throw new NotFoundError('Attempt');
  if (attempt.studentId !== studentId) throw new BadRequestError('Not your attempt');
  if (attempt.status !== 'in_progress') throw new BadRequestError('Already submitted');

  const question = await prisma.assignmentQuestion.findUnique({ where: { id: questionId }, include: { options: true } });
  if (!question) throw new NotFoundError('Question');

  let isCorrect = false;
  let pointsEarned = 0;

  if (question.questionType === 'multiple_choice' && selectedOptionId) {
    const opt = question.options.find((o) => o.id === selectedOptionId);
    if (opt) { isCorrect = opt.isCorrect; pointsEarned = isCorrect ? question.points : 0; }
  }

  return prisma.assignmentAnswer.upsert({
    where: { questionId_attemptId: { questionId, attemptId } },
    create: { attemptId, questionId, studentId, answer, selectedOptionId, isCorrect, pointsEarned },
    update: { answer, selectedOptionId, isCorrect, pointsEarned },
  });
};

export const submitAttempt = async (attemptId: string, studentId: string) => {
  const attempt = await prisma.assignmentAttempt.findUnique({
    where: { id: attemptId },
    include: { assignment: { include: { questions: { include: { options: true } } } }, answers: true },
  });
  if (!attempt) throw new NotFoundError('Attempt');
  if (attempt.studentId !== studentId) throw new BadRequestError('Not your attempt');
  if (attempt.status !== 'in_progress') throw new BadRequestError('Already submitted');

  let totalEarned = 0;
  const totalPoints = attempt.assignment.totalPoints;

  for (const question of attempt.assignment.questions) {
    const answer = attempt.answers.find((a) => a.questionId === question.id);
    if (answer) totalEarned += answer.pointsEarned;
  }

  const percentage = totalPoints > 0 ? Math.round((totalEarned / totalPoints) * 100) : 0;

  const updated = await prisma.assignmentAttempt.update({
    where: { id: attemptId },
    data: { status: 'submitted', submittedAt: new Date(), score: totalEarned, percentage },
    include: {
      assignment: { include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } } },
      answers: { include: { question: { include: { options: { orderBy: { orderIndex: 'asc' } } } }, selectedOption: true } },
    },
  });
  return updated;
};

export const getAttemptById = async (attemptId: string, userId: string) => {
  const attempt = await prisma.assignmentAttempt.findUnique({
    where: { id: attemptId },
    include: {
      assignment: { include: { questions: { orderBy: { orderIndex: 'asc' }, include: { options: { orderBy: { orderIndex: 'asc' } } } } } },
      answers: { include: { question: { include: { options: { orderBy: { orderIndex: 'asc' } } } }, selectedOption: true } },
    },
  });
  if (!attempt) throw new NotFoundError('Attempt');
  if (attempt.studentId !== userId) throw new BadRequestError('Not authorized');
  return attempt;
};

export const getMyAttempts = async (assignmentId: string, studentId: string) => {
  return prisma.assignmentAttempt.findMany({
    where: { assignmentId, studentId },
    orderBy: { attemptNumber: 'desc' },
    include: { answers: { include: { question: { include: { options: { orderBy: { orderIndex: 'asc' } } } }, selectedOption: true } } },
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
