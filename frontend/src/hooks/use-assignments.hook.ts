import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as assignmentService from '../services/assignment.service';

export function useAssignmentsByCourse(courseId: string) {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => assignmentService.getAssignmentsByCourse(courseId),
    enabled: !!courseId,
  });
}

export function useMySubmissions() {
  return useQuery({
    queryKey: ['mySubmissions'],
    queryFn: () => assignmentService.getMySubmissions(),
  });
}

export function useSubmissionByAssignment(assignmentId: string) {
  return useQuery({
    queryKey: ['submission', assignmentId],
    queryFn: () => assignmentService.getSubmissionByAssignment(assignmentId),
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

export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, link }: { id: string; link: string }) => assignmentService.submitAssignment(id, link),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
    },
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: string; mentorFeedback?: string } }) =>
      assignmentService.reviewSubmission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSubmissions'] });
    },
  });
}
