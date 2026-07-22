import apiClient from './api-client.service';

export const getSettings = async (): Promise<Record<string, any>> => {
  const response = await apiClient.get('/settings');
  return response.data;
};

export const updateSetting = async (data: { key: string; value: string; description?: string }) => {
  const response = await apiClient.put('/settings', data);
  return response.data;
};

export const deleteSetting = async (key: string) => {
  const response = await apiClient.delete(`/settings/${key}`);
  return response.data;
};
