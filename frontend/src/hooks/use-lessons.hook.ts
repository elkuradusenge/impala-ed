import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as lessonService from '../services/lesson.service';
import * as moduleService from '../services/module.service';

export function useModulesByCourse(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => moduleService.getModulesByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useLessonsByModule(moduleId: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => lessonService.getLessonsByModule(moduleId),
    enabled: !!moduleId,
  });
}

export function useLessonProgress(courseId: string) {
  return useQuery({
    queryKey: ['lessonProgress', courseId],
    queryFn: () => lessonService.getLessonProgress(courseId),
    enabled: !!courseId,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) => lessonService.completeLesson(lessonId),
    onSuccess: (_data, lessonId) => {
      queryClient.invalidateQueries({ queryKey: ['lessonProgress'] });
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
    },
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => moduleService.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => lessonService.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
    },
  });
}
