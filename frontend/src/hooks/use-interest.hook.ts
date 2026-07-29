import { useQuery, useMutation } from '@tanstack/react-query';
import * as interestService from '../services/interest.service';

/**
 * Fetch all available courses for the interest selection step during registration.
 * Public endpoint — no auth required.
 */
export function useAvailableInterests() {
  return useQuery({
    queryKey: ['availableInterests'],
    queryFn: () => interestService.getAvailableInterests(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Save the user's course interests after registration.
 */
export function useSaveCourseInterests() {
  return useMutation({
    mutationFn: (courseIds: string[]) =>
      interestService.saveCourseInterests({ courseIds }),
  });
}
