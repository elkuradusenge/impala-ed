import { useQuery } from '@tanstack/react-query';
import * as userService from '../services/user.service';

export function useUsers(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}
