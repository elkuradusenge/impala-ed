import apiClient from './api-client.service';

export interface MessageData {
  id: string;
  sender: { id: string; name: string; email: string; profilePicture?: string };
  receiver: { id: string; name: string; email: string; profilePicture?: string };
  subject?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  partner: { id: string; name: string; email: string; profilePicture?: string };
  lastMessage: MessageData;
  unreadCount: number;
}

export const sendMessage = async (data: { receiver: string; subject?: string; content: string }): Promise<MessageData> => {
  const response = await apiClient.post('/messages', data);
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await apiClient.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (userId: string): Promise<MessageData[]> => {
  const response = await apiClient.get(`/messages/${userId}`);
  return response.data;
};

export const deleteMessage = async (id: string) => {
  const response = await apiClient.delete(`/messages/${id}`);
  return response.data;
};

export const getUnreadMessageCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get('/messages/unread');
  return response.data;
};
