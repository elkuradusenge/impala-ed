import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as courseService from '../services/course.service';

export function useCourses(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseService.getCourses(params),
  });
}

export function useCourseById(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => courseService.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => courseService.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.archiveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useApproveCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.approveCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => courseService.getCategories(),
  });
}
