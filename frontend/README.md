# ImpalaEd — Frontend

React 18 + TypeScript + Vite + Tailwind CSS + React Query

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Library | React 18 |
| Language | TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Server State | TanStack React Query 5 |
| Routing | React Router DOM 6 |
| HTTP Client | Axios |
| Icons | FontAwesome 6 |
| Toasts | Sonner |
| PDF | react-pdf |

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Routes + providers
│   ├── index.css               # Tailwind + custom styles
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── layout/             # Navbar, Layout wrapper
│   │   ├── LoadingSpinner.component.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RouteGuard.tsx      # Role-based route gating
│   │   └── StatCard.component.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx      # Global auth state
│   ├── hooks/                  # React Query hooks per domain
│   ├── pages/
│   │   ├── public/             # Landing, login, register, courses
│   │   ├── student/            # Dashboard, learning, assignments
│   │   ├── mentor/             # Dashboard, course/assignment/lesson mgmt
│   │   └── admin/              # Dashboard, users, courses, reports
│   ├── services/               # Axios API clients
│   └── utils/
│       └── storage.utils.ts    # localStorage helpers
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Routing Map

| Path | Page | Access |
|------|------|--------|
| `/` | Landing page | Public |
| `/login` | Login | Public |
| `/register` | Registration (role + interests) | Public |
| `/forgot-password` | Password reset | Public |
| `/about` | About us | Public |
| `/courses` | Course catalogue | Public (auth-aware) |
| `/courses/:id` | Course details | Public (enrollment gated) |
| `/student/dashboard` | Student dashboard | Student |
| `/learning/:courseId` | Lesson viewer + progress | Student |
| `/assignments/:courseId` | Assessment taking | Student |
| `/progress` | Learning progress | Student |
| `/mentor/dashboard` | Mentor dashboard | Mentor/Admin |
| `/mentor/courses` | Course management | Mentor/Admin |
| `/mentor/courses/:courseId/modules` | Module management | Mentor/Admin |
| `/mentor/modules/:moduleId/lessons` | Lesson management | Mentor/Admin |
| `/mentor/assignments` | Assessment management | Mentor/Admin |
| `/mentor/progress` | Student progress view | Mentor/Admin |
| `/admin/dashboard` | Admin dashboard | Admin |
| `/admin/users` | User management | Admin |
| `/admin/courses` | Course oversight | Admin |
| `/admin/reports` | Reports | Admin |
| `/admin/settings` | System settings | Admin |
| `/messages` | Messaging | Any authenticated |
| `/profile` | User profile | Any authenticated |
| `/dashboard` | Role-based redirect | Any authenticated |

## Key Pages & User Flows

### Student Flow

1. **Browse courses** → `/courses` (filter by search, see all published courses)
2. **View course** → `/courses/:id` (description, modules, learning objectives)
3. **Enroll** → button on course page → enrolled!
4. **Learn** → `/learning/:courseId` (sidebar with modules/lessons, inline PDF viewer, mark lessons complete)
5. **Take assessment** → `/assignments/:courseId` (intro → MCQ/text questions → submit → results)
6. **Track progress** → `/progress`

### Mentor Flow

1. **Create course** → `/mentor/courses` (title, description, category, objectives)
2. **Add modules/lessons** → module & lesson management pages
3. **Upload PDFs** → attach to lessons as learning materials
4. **Publish course** → toggle publish on course list
5. **Create assessment** → `/mentor/assignments` (add text or MCQ questions, set passing score, time limit)
6. **Publish assessment** → toggle publish
7. **Review submissions** → mark student submissions as reviewed

### Admin Flow

1. **Manage users** → `/admin/users`
2. **Approve courses** → `/admin/courses`
3. **System settings** → `/admin/settings`

## Auth Context

The `AuthContext` at `contexts/AuthContext.tsx` provides:

- `user` — current user object (id, name, email, role)
- `isAuthenticated`, `isStudent`, `isMentor`, `isAdmin` — boolean flags
- `login()`, `register()`, `logout()` — auth actions
- `updateProfile()`, `changePassword()` — profile management
- `loading` — initial auth check state

The `RouteGuard` component wraps pages that require specific roles.

## Hooks (React Query)

Each domain has a dedicated hook file in `hooks/`:

| Hook file | Key queries |
|-----------|-------------|
| `use-auth.hook.ts` | Auth state from context (no queries) |
| `use-courses.hook.ts` | `useCourses`, `useCourseById`, create/update/delete mutations |
| `use-enrollment.hook.ts` | `useEnrolledCourses`, `useCheckEnrollment`, enroll/unenroll |
| `use-assignments.hook.ts` | `useAssignmentsByCourse`, `useMyAttempts`, start/save/submit attempt |
| `use-lessons.hook.ts` | `useLessonProgress`, `useCompleteLesson`, modules/lessons queries |
| `use-interest.hook.ts` | `useAvailableInterests`, `useSaveCourseInterests` |
| `use-dashboard.hook.ts` | Role-based dashboard stats |
| `use-messages.hook.ts` | Conversations, messages, send |
| `use-module.hook.ts` | Module by ID |

## Services (API Clients)

Each service in `services/` wraps an axios instance (`api-client.service.ts`) that:

- Auto-attaches the JWT Bearer token from localStorage
- Redirects to `/login` on 401 responses
- Has `baseURL: '/api'` (proxied to backend via Vite)

Key services: `course.service`, `auth.service`, `enrollment.service`, `assignment.service`, `pdf.service`, `lesson.service`, `interest.service`, `message.service`, `notification.service`, `dashboard.service`.

## Environment / Config

- Vite proxy in `vite.config.ts` forwards `/api` to the backend
- API base URL defaults to `/api` (relative, proxied in dev)
- Static files (uploaded PDFs) served from `/uploads`

## Running

```bash
npm run dev        # Start Vite dev server (port 5173)
npm run build      # Production build
npx tsc --noEmit   # Type-check
```
