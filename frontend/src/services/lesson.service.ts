import apiClient from './api-client.service';

export interface LessonData {
  id: string;
  title: string;
  description?: string;
  moduleId: string;
  courseId: string;
  order: number;
  pdfDocument?: any;
  duration?: string;
}

export interface LessonProgress {
  completedLessons: string[];
  currentLesson: LessonData | null;
  totalLessons: number;
  completedCount: number;
  percentage: number;
  completed: boolean;
}

export const getLessonsByModule = async (moduleId: string): Promise<LessonData[]> => {
  const response = await apiClient.get(`/lessons/module/${moduleId}`);
  return response.data;
};

export const getLessonById = async (id: string): Promise<LessonData> => {
  const response = await apiClient.get(`/lessons/${id}`);
  return response.data;
};

export const createLesson = async (data: Partial<LessonData> & { module: string; course: string }): Promise<LessonData> => {
  const response = await apiClient.post('/lessons', data);
  return response.data;
};

export const updateLesson = async (id: string, data: Partial<LessonData>): Promise<LessonData> => {
  const response = await apiClient.put(`/lessons/${id}`, data);
  return response.data;
};

export const deleteLesson = async (id: string) => {
  const response = await apiClient.delete(`/lessons/${id}`);
  return response.data;
};

export const completeLesson = async (id: string) => {
  const response = await apiClient.put(`/lessons/${id}/complete`);
  return response.data;
};

export const getLessonProgress = async (courseId: string): Promise<LessonProgress> => {
  const response = await apiClient.get(`/lessons/progress/${courseId}`);
  return response.data;
};
