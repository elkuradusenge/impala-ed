import apiClient from './api-client.service';

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
}

export interface AssignmentQuestion {
  id: string;
  assignmentId: string;
  questionText: string;
  questionType: string;
  points: number;
  explanation: string;
  orderIndex: number;
  isRequired: boolean;
  options: QuestionOption[];
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  courseId: string;
  mentorId: string;
  totalPoints: number;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  isPublished: boolean;
  dueDate: string | null;
  isActive: boolean;
  questions: AssignmentQuestion[];
  mentor?: { id: string; name: string };
  course?: { id: string; title: string };
  createdAt: string;
}

export interface AttemptData {
  id: string;
  assignmentId: string;
  studentId: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string | null;
  score: number;
  percentage: number;
  status: string;
  assignment?: AssignmentData;
  answers?: AnswerData[];
}

export interface AnswerData {
  id: string;
  attemptId: string;
  questionId: string;
  studentId: string;
  answer: string;
  selectedOptionId: string | null;
  isCorrect: boolean;
  pointsEarned: number;
  question?: AssignmentQuestion;
  selectedOption?: QuestionOption;
}

export const createAssignment = async (data: any): Promise<AssignmentData> => {
  const r = await apiClient.post('/assignments', data);
  return r.data;
};

export const getAssignmentsByCourse = async (courseId: string): Promise<AssignmentData[]> => {
  const r = await apiClient.get(`/assignments/course/${courseId}`);
  return r.data;
};

export const getAssignmentById = async (id: string): Promise<AssignmentData> => {
  const r = await apiClient.get(`/assignments/${id}`);
  return r.data;
};

export const updateAssignment = async (id: string, data: any): Promise<AssignmentData> => {
  const r = await apiClient.put(`/assignments/${id}`, data);
  return r.data;
};

export const togglePublishAssignment = async (id: string, isPublished: boolean): Promise<AssignmentData> => {
  const r = await apiClient.put(`/assignments/${id}/publish`, { isPublished });
  return r.data;
};

export const deactivateAssignment = async (id: string) => {
  const r = await apiClient.delete(`/assignments/${id}`);
  return r.data;
};

export const startAttempt = async (assignmentId: string): Promise<AttemptData> => {
  const r = await apiClient.post(`/assignments/${assignmentId}/start`);
  return r.data;
};

export const saveAnswer = async (attemptId: string, questionId: string, answer: string, selectedOptionId?: string | null): Promise<AnswerData> => {
  const r = await apiClient.post(`/assignments/attempts/${attemptId}/answer`, { questionId, answer, selectedOptionId });
  return r.data;
};

export const submitAttempt = async (attemptId: string): Promise<AttemptData> => {
  const r = await apiClient.post(`/assignments/attempts/${attemptId}/submit`);
  return r.data;
};

export const getAttemptById = async (attemptId: string): Promise<AttemptData> => {
  const r = await apiClient.get(`/assignments/attempts/${attemptId}`);
  return r.data;
};

export const getMyAttempts = async (assignmentId: string): Promise<AttemptData[]> => {
  const r = await apiClient.get(`/assignments/${assignmentId}/my-attempts`);
  return r.data;
};

export const getAllSubmissions = async (courseId: string): Promise<any[]> => {
  const r = await apiClient.get(`/assignments/submissions/${courseId}`);
  return r.data;
};

export const reviewSubmission = async (id: string, data: { status: string; mentorFeedback?: string }) => {
  const r = await apiClient.put(`/assignments/submissions/${id}/review`, data);
  return r.data;
};
