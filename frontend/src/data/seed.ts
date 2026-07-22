/**
 * Course Seed Data
 * These are the initial courses available on the platform.
 * During registration, students and mentors select courses they're interested in.
 */
export const COURSE_SEED_DATA = [
  {
    id: 'seed-web-dev',
    name: 'Web Development',
    category: 'Technology',
    description: 'Learn modern frontend and backend development',
  },
  {
    id: 'seed-mobile-dev',
    name: 'Mobile Application Development',
    category: 'Technology',
    description: 'Build Android and iOS applications',
  },
  {
    id: 'seed-data-science',
    name: 'Data Science',
    category: 'Technology',
    description: 'Learn data analysis and machine learning',
  },
  {
    id: 'seed-ai',
    name: 'Artificial Intelligence',
    category: 'Technology',
    description: 'Explore AI concepts and applications',
  },
  {
    id: 'seed-cybersecurity',
    name: 'Cyber Security',
    category: 'Technology',
    description: 'Protect systems and networks from digital attacks',
  },
  {
    id: 'seed-ux-design',
    name: 'UI/UX Design',
    category: 'Design',
    description: 'Create user-centered digital experiences',
  },
] as const;

export type CourseInterestId = (typeof COURSE_SEED_DATA)[number]['id'];

/**
 * Admin Seed Account
 * Created once during initial platform setup.
 */
export const ADMIN_SEED_ACCOUNT = {
  name: 'System Administrator',
  email: 'admin@platform.com',
  role: 'admin' as const,
  settings: {
    theme: 'light' as const,
    notifications: true,
    language: 'en' as const,
    timezone: 'Africa/Kigali',
  },
};
