import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as assignmentService from '../services/assignment.service';

export function useAssignmentsByCourse(courseId: string) {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => assignmentService.getAssignmentsByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useAssignmentById(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignmentById(id),
    enabled: !!id,
  });
}

export function useCreateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => assignmentService.createAssignment(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  });
}

export function useUpdateAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => assignmentService.updateAssignment(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['assignments'] }); qc.invalidateQueries({ queryKey: ['assignment'] }); },
  });
}

export function useTogglePublishAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => assignmentService.togglePublishAssignment(id, isPublished),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  });
}

export function useStartAttempt() {
  return useMutation({ mutationFn: (id: string) => assignmentService.startAttempt(id) });
}

export function useSaveAnswer() {
  return useMutation({
    mutationFn: ({ attemptId, questionId, answer, selectedOptionId }: { attemptId: string; questionId: string; answer: string; selectedOptionId?: string | null }) =>
      assignmentService.saveAnswer(attemptId, questionId, answer, selectedOptionId),
  });
}

export function useSubmitAttempt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => assignmentService.submitAttempt(attemptId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['attempt'] }); qc.invalidateQueries({ queryKey: ['assignments'] }); },
  });
}

export function useAttemptById(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: () => assignmentService.getAttemptById(attemptId),
    enabled: !!attemptId,
  });
}

export function useMyAttempts(assignmentId: string) {
  return useQuery({
    queryKey: ['myAttempts', assignmentId],
    queryFn: () => assignmentService.getMyAttempts(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useAllSubmissions(courseId: string) {
  return useQuery({
    queryKey: ['allSubmissions', courseId],
    queryFn: () => assignmentService.getAllSubmissions(courseId),
    enabled: !!courseId,
  });
}

export function useReviewSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; mentorFeedback?: string } }) =>
      assignmentService.reviewSubmission(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['allSubmissions'] }),
  });
}
