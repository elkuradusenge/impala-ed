import apiClient from './api-client.service';

export interface AssignmentData {
  id: string;
  title: string;
  description?: string;
  instructions: string;
  courseId: string;
  course?: { id: string; title: string };
  mentor?: { id: string; name: string };
  googleDocsLink?: string;
  dueDate?: string;
  isActive?: boolean;
  createdAt: string;
}

export interface SubmissionData {
  id: string;
  assignmentId: string;
  assignment?: AssignmentData;
  studentId: string;
  student?: { id: string; name: string; email: string };
  courseId: string;
  submittedLink: string;
  status: 'pending' | 'submitted' | 'reviewed';
  mentorFeedback?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export const createAssignment = async (data: Partial<AssignmentData>): Promise<AssignmentData> => {
  const response = await apiClient.post('/assignments', data);
  return response.data;
};

export const getAssignmentsByCourse = async (courseId: string): Promise<AssignmentData[]> => {
  const response = await apiClient.get(`/assignments/course/${courseId}`);
  return response.data;
};

export const getAssignmentById = async (id: string): Promise<AssignmentData> => {
  const response = await apiClient.get(`/assignments/${id}`);
  return response.data;
};

export const updateAssignment = async (id: string, data: Partial<AssignmentData>): Promise<AssignmentData> => {
  const response = await apiClient.put(`/assignments/${id}`, data);
  return response.data;
};

export const deactivateAssignment = async (id: string) => {
  const response = await apiClient.delete(`/assignments/${id}`);
  return response.data;
};

export const submitAssignment = async (id: string, submittedLink: string): Promise<SubmissionData> => {
  const response = await apiClient.post(`/assignments/${id}/submit`, { submittedLink });
  return response.data;
};

export const getMySubmissions = async (): Promise<SubmissionData[]> => {
  const response = await apiClient.get('/assignments/my-submissions');
  return response.data;
};

export const getSubmissionByAssignment = async (assignmentId: string): Promise<SubmissionData | null> => {
  const response = await apiClient.get(`/assignments/my-submission/${assignmentId}`);
  return response.data;
};

export const getAllSubmissions = async (courseId: string): Promise<SubmissionData[]> => {
  const response = await apiClient.get(`/assignments/submissions/${courseId}`);
  return response.data;
};

export const reviewSubmission = async (id: string, data: { status: string; mentorFeedback?: string }): Promise<SubmissionData> => {
  const response = await apiClient.put(`/assignments/submissions/${id}/review`, data);
  return response.data;
};
