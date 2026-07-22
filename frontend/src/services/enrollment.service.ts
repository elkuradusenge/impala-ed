import apiClient from './api-client.service';

export const enrollCourse = async (courseId: string) => {
  const response = await apiClient.post(`/enrollments/${courseId}`);
  return response.data;
};

export const unenrollCourse = async (courseId: string) => {
  const response = await apiClient.delete(`/enrollments/${courseId}`);
  return response.data;
};

export const getEnrolledCourses = async (): Promise<any[]> => {
  const response = await apiClient.get('/enrollments');
  return response.data;
};

export const checkEnrollment = async (courseId: string): Promise<{ enrolled: boolean }> => {
  const response = await apiClient.get(`/enrollments/check/${courseId}`);
  return response.data;
};

export const getStudentProgress = async (studentId: string, courseId: string) => {
  const response = await apiClient.get(`/enrollments/progress/${studentId}/${courseId}`);
  return response.data;
};
