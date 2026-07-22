import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as messageService from '../services/message.service';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
  });
}

export function useMessages(userId: string) {
  return useQuery({
    queryKey: ['messages', userId],
    queryFn: () => messageService.getMessages(userId),
    enabled: !!userId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { receiver: string; subject?: string; content: string }) => messageService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
