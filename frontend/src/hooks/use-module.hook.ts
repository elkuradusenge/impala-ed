import { useQuery } from '@tanstack/react-query';
import * as moduleService from '../services/module.service';

export function useModuleById(id: string) {
  return useQuery({
    queryKey: ['module', id],
    queryFn: () => moduleService.getModuleById(id),
    enabled: !!id,
  });
}
