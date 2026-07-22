import apiClient from './api-client.service';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  profilePicture?: string;
  bio?: string;
  createdAt: string;
}

export const getUsers = async (params?: Record<string, string>): Promise<UserData[]> => {
  const response = await apiClient.get('/users', { params });
  return response.data;
};

export const getUserById = async (id: string): Promise<UserData> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<UserData>): Promise<UserData> => {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
};

export const deactivateUser = async (id: string) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const resetUserPassword = async (id: string, newPassword: string) => {
  const response = await apiClient.put(`/users/${id}/reset-password`, { newPassword });
  return response.data;
};

export const createStudent = async (data: { name: string; email: string; password: string }) => {
  const response = await apiClient.post('/users/create-student', data);
  return response.data;
};
