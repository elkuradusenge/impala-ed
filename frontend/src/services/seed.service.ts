import apiClient from './api-client.service';

/**
 * Seed initial courses into the backend.
 * The backend should upsert based on a unique title or slug.
 */
export const seedCourses = async () => {
  const response = await apiClient.post('/seed/courses');
  return response.data;
};

/**
 * Seed the default admin account.
 * The backend should skip if admin already exists.
 */
export const seedAdmin = async () => {
  const response = await apiClient.post('/seed/admin');
  return response.data;
};

/**
 * Check if platform has been seeded already.
 */
export const getSeedStatus = async (): Promise<{ seeded: boolean }> => {
  const response = await apiClient.get('/seed/status');
  return response.data;
};
