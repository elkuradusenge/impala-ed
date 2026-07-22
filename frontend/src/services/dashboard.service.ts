import apiClient from './api-client.service';

export interface StudentDashboard {
  activeEnrollments: number;
  completedCourses: number;
  overallProgress: number;
  totalLessons: number;
  totalCompleted: number;
  pendingAssignments: number;
  reviewedAssignments: number;
  unreadMessages: number;
  recentCourses: any[];
}

export interface MentorDashboard {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  completedEnrollments: number;
  totalAssignments: number;
  pendingReviews: number;
  unreadMessages: number;
}

export interface AdminDashboard {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  totalCourses: number;
  publishedCourses: number;
  activeEnrollments: number;
  completedCourses: number;
  totalAssignments: number;
}

export const getStudentDashboard = async (): Promise<StudentDashboard> => {
  const response = await apiClient.get('/dashboard/student');
  return response.data;
};

export const getMentorDashboard = async (): Promise<MentorDashboard> => {
  const response = await apiClient.get('/dashboard/mentor');
  return response.data;
};

export const getAdminDashboard = async (): Promise<AdminDashboard> => {
  const response = await apiClient.get('/dashboard/admin');
  return response.data;
};
