import { useQuery, useMutation } from '@tanstack/react-query';
import * as seedService from '../services/seed.service';

/**
 * Check whether the platform seed data (courses + admin) has been initialized.
 */
export function useSeedStatus() {
  return useQuery({
    queryKey: ['seed-status'],
    queryFn: () => seedService.getSeedStatus(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Seed the initial courses into the database.
 */
export function useSeedCourses() {
  return useMutation({
    mutationFn: () => seedService.seedCourses(),
  });
}

/**
 * Seed the default admin account.
 */
export function useSeedAdmin() {
  return useMutation({
    mutationFn: () => seedService.seedAdmin(),
  });
}
