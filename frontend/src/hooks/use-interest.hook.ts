import { useMutation } from '@tanstack/react-query';
import * as interestService from '../services/interest.service';

/**
 * Save the user's course interests after registration.
 */
export function useSaveCourseInterests() {
  return useMutation({
    mutationFn: (courseIds: string[]) =>
      interestService.saveCourseInterests({ courseIds }),
  });
}
