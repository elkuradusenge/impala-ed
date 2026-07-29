import apiClient from './api-client.service';

export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  difficultyLevel: string;
  duration?: string;
  learningObjectives?: string[];
  mentor?: { id: string; name: string; email: string; profilePicture?: string };
  category?: { id: string; name: string };
  modules?: any[];
  courseMaterials?: { id: string; title: string; fileName: string; originalName: string; fileSize: number; createdAt: string }[];
  isPublished?: boolean;
  isApproved?: boolean;
  isArchived?: boolean;
  isFeatured?: boolean;
  enrollmentCount?: number;
  createdAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
}

export const getCourses = async (params?: Record<string, string>): Promise<Course[]> => {
  const response = await apiClient.get('/courses', { params });
  return response.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await apiClient.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: Partial<Course>): Promise<Course> => {
  const response = await apiClient.post('/courses', data);
  return response.data;
};

export const updateCourse = async (id: string, data: Partial<Course>): Promise<Course> => {
  const response = await apiClient.put(`/courses/${id}`, data);
  return response.data;
};

export const archiveCourse = async (id: string) => {
  const response = await apiClient.delete(`/courses/${id}`);
  return response.data;
};

export const approveCourse = async (id: string): Promise<Course> => {
  const response = await apiClient.put(`/courses/${id}/approve`);
  return response.data;
};

export const getCategories = async (): Promise<CourseCategory[]> => {
  const response = await apiClient.get('/courses/categories/all');
  return response.data;
};

export const createCategory = async (data: { name: string; description?: string }): Promise<CourseCategory> => {
  const response = await apiClient.post('/courses/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: Partial<CourseCategory>): Promise<CourseCategory> => {
  const response = await apiClient.put(`/courses/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/courses/categories/${id}`);
  return response.data;
};
