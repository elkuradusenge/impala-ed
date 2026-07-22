import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as enrollmentService from '../services/enrollment.service';

export function useEnrolledCourses(enabled = true) {
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => enrollmentService.getEnrolledCourses(),
    enabled,
  });
}

export function useCheckEnrollment(courseId: string, enabled = true) {
  return useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: () => enrollmentService.checkEnrollment(courseId),
    enabled: !!courseId && enabled,
  });
}

export function useEnrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => enrollmentService.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
}

export function useUnenrollCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => enrollmentService.unenrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment'] });
    },
  });
}
