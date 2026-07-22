import apiClient from './api-client.service';

export interface InterestPayload {
  courseIds: string[];
}

/**
 * Save the courses a user is interested in during registration.
 */
export const saveCourseInterests = async (data: InterestPayload) => {
  const response = await apiClient.post('/auth/interests', data);
  return response.data;
};

/**
 * Get all available course categories/interests for selection.
 */
export const getAvailableInterests = async () => {
  const response = await apiClient.get('/courses/categories/all');
  return response.data;
};
