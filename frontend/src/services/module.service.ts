import apiClient from './api-client.service';

export interface ModuleData {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  order: number;
  lessons?: any[];
}

export const getModulesByCourse = async (courseId: string): Promise<ModuleData[]> => {
  const response = await apiClient.get(`/modules/course/${courseId}`);
  return response.data;
};

export const getModuleById = async (id: string): Promise<ModuleData> => {
  const response = await apiClient.get(`/modules/${id}`);
  return response.data;
};

export const createModule = async (data: { title: string; description?: string; courseId: string; order?: number }): Promise<ModuleData> => {
  const response = await apiClient.post('/modules', data);
  return response.data;
};

export const updateModule = async (id: string, data: Partial<ModuleData>): Promise<ModuleData> => {
  const response = await apiClient.put(`/modules/${id}`, data);
  return response.data;
};

export const deleteModule = async (id: string) => {
  const response = await apiClient.delete(`/modules/${id}`);
  return response.data;
};

export const reorderModules = async (moduleIds: string[]) => {
  const response = await apiClient.put('/modules/reorder', { modules: moduleIds });
  return response.data;
};
