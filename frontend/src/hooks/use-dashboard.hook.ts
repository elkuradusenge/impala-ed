import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboard.service';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: () => dashboardService.getStudentDashboard(),
  });
}

export function useMentorDashboard() {
  return useQuery({
    queryKey: ['mentorDashboard'],
    queryFn: () => dashboardService.getMentorDashboard(),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => dashboardService.getAdminDashboard(),
  });
}
