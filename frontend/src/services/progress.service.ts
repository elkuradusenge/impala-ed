import apiClient from './api-client.service';

export const getStudentProgressByMentor = async (courseId: string) => {
  const response = await apiClient.get(`/progress/course/${courseId}`);
  return response.data;
};

export const getStudentsNotCompleted = async (courseId: string) => {
  const response = await apiClient.get(`/progress/course/${courseId}/incomplete`);
  return response.data;
};
