import apiClient from './api-client.service';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  profilePicture?: string;
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await apiClient.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: { name?: string; bio?: string; profilePicture?: string }) => {
  const response = await apiClient.put('/auth/profile', data);
  return response.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
  const response = await apiClient.put('/auth/change-password', data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await apiClient.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};
