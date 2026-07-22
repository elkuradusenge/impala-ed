import apiClient from './api-client.service';

export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationData[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markAsRead = async (id: string): Promise<NotificationData> => {
  const response = await apiClient.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await apiClient.put('/notifications/read-all');
  return response.data;
};

export const getUnreadNotificationCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get('/notifications/unread-count');
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};
