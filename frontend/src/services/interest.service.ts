import apiClient from './api-client.service';

export interface InterestPayload {
  courseIds: string[];
}

/**
 * Save the courses a user is interested in during registration.
 * POST /api/interests (auth required)
 */
export const saveCourseInterests = async (data: InterestPayload) => {
  const response = await apiClient.post('/interests', data);
  return response.data;
};

/**
 * Get all available courses for interest selection on the registration form.
 * GET /api/interests/available (public — no auth required)
 */
export const getAvailableInterests = async () => {
  const response = await apiClient.get('/interests/available');
  return response.data;
};
