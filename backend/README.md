# ImpalaEd — Backend

Node.js + Express + TypeScript + Prisma + PostgreSQL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) |
| File Upload | Multer |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (all models)
│   ├── seed.ts                # Seed script with demo accounts
│   └── migrations/            # Auto-generated migrations
├── src/
│   ├── server.ts              # Express app entry point
│   ├── config/
│   │   └── database.ts        # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.ts            # JWT protect + optionalAuth + role authorize
│   │   └── errorHandler.ts    # Global error handler
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── routes/                # Route definitions
│   ├── types/
│   │   └── index.ts           # Shared TypeScript types
│   └── utils/
│       ├── asyncWrapper.ts    # Async error catcher
│       ├── errors.ts          # Custom error classes
│       ├── formatters.ts      # Slugify, etc.
│       ├── generateToken.ts   # JWT generation
│       └── upload.ts          # Multer PDF upload config
└── uploads/                   # Uploaded PDF files
```

## API Routes

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/profile` | Required | Get current user profile |
| PUT | `/profile` | Required | Update profile |
| PUT | `/password` | Required | Change password |
| POST | `/forgot-password` | Public | Request reset link |
| POST | `/reset-password/:token` | Public | Reset password |

### Courses — `/api/courses`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Optional | List courses (filtered by role) |
| GET | `/:id` | Optional | Get course by ID |
| POST | `/` | Mentor/Admin | Create course |
| PUT | `/:id` | Mentor/Admin | Update course |
| DELETE | `/:id` | Mentor/Admin | Archive course |
| PUT | `/:id/approve` | Admin | Approve course |
| GET | `/categories/all` | Optional | List categories |
| POST | `/categories` | Admin | Create category |

### Enrollments — `/api/enrollments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Required | Get enrolled courses |
| POST | `/:courseId` | Required | Enroll in course |
| DELETE | `/:courseId` | Required | Unenroll |
| GET | `/check/:courseId` | Required | Check enrollment status |
| GET | `/progress/:studentId/:courseId` | Mentor/Admin | Student progress |

### Lessons — `/api/lessons`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/progress/:courseId` | Required | Get lesson progress |
| PUT | `/:id/complete` | Required | Mark lesson completed |
| GET | `/module/:moduleId` | Required | Lessons by module |
| GET | `/:id` | Required | Get lesson by ID |
| POST | `/` | Mentor/Admin | Create lesson |
| PUT | `/:id` | Mentor/Admin | Update lesson |
| DELETE | `/:id` | Mentor/Admin | Delete lesson |

### Assignments (Assessments) — `/api/assignments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/course/:courseId` | Required | List assessments |
| GET | `/:id` | Required | Get assessment by ID |
| POST | `/` | Mentor/Admin | Create assessment (text + MCQ) |
| PUT | `/:id` | Mentor/Admin | Update assessment |
| PUT | `/:id/publish` | Mentor/Admin | Publish/unpublish |
| DELETE | `/:id` | Mentor/Admin | Deactivate |
| POST | `/:id/start` | Required | Start an attempt |
| POST | `/attempts/:attemptId/answer` | Required | Save an answer |
| POST | `/attempts/:attemptId/submit` | Required | Submit & auto-grade |
| GET | `/attempts/:attemptId` | Required | Get attempt results |
| GET | `/:assignmentId/my-attempts` | Required | My attempts |
| GET | `/submissions/:courseId` | Mentor/Admin | All submissions |
| PUT | `/submissions/:id/review` | Mentor/Admin | Review submission |

### PDF — `/api/pdf`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload` | Mentor/Admin | Upload PDF |
| GET | `/` | Required | List PDFs |
| GET | `/:id` | Required | Get PDF metadata |
| GET | `/:id/serve` | **Public** | Stream PDF file |
| DELETE | `/:id` | Mentor/Admin | Delete PDF |

### Interests — `/api/interests`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/available` | Public | Courses for interest selection |
| POST | `/` | Required | Save course interests |
| GET | `/mine` | Required | Get my interests |

### Modules — `/api/modules` | Messages — `/api/messages` | Notifications — `/api/notifications` | Settings — `/api/settings` | Dashboard — `/api/dashboard`

All require authentication. See route files for details.

## Database Schema

Key models in `prisma/schema.prisma`:

- **User** — students, mentors, admins
- **Course** — courses with mentor, category, published/approved status
- **Module / Lesson** — content hierarchy, lessons link to PDFs
- **PdfDocument** — uploaded PDFs linked to lessons or courses
- **Enrollment** — student-course enrollment with progress tracking
- **Assignment / AssignmentQuestion / QuestionOption** — text + MCQ assessments
- **AssignmentAttempt / AssignmentAnswer** — student attempts with auto-grading
- **AssignmentSubmission** — submission tracking with review status
- **CourseInterest** — registration preferences (separate from enrollments)
- **Message / Notification / AuditLog** — communication and logging

## Services Overview

Each domain has a corresponding service in `src/services/`:

- **auth.service** — Registration, login, JWT, password management
- **course.service** — CRUD, filtering by role, categories
- **enrollment.service** — Enroll/unenroll, progress tracking
- **lesson.service** — Lesson CRUD, completion tracking, enrollment-based progress
- **pdf.service** — PDF upload, file serving, deletion
- **assignment.service** — Full assessment lifecycle: create MCQ/text questions, start attempts, auto-grade, review
- **interest.service** — Course interest management
- **module.service** — Module CRUD
- **dashboard.service** — Role-based dashboard stats

## Authentication

JWT-based with three middleware functions in `middleware/auth.ts`:

- **`protect`** — Requires valid JWT, sets `req.user`
- **`optionalAuth`** — Reads JWT if present, doesn't block anonymous
- **`authorize(...roles)`** — Restricts to specific roles

Demo accounts (from seed):
- `admin@impalaed.com` / `admin123`
- `mentor@impalaed.com` / `mentor123`
- `student@impalaed.com` / `student123`

## Running Tests / Build

```bash
npm install
# npm prisma:seed # optional (only execute if you want to use seed that as mentioned above)
npm run dev        # Start dev server with hot reload
npx tsc --noEmit   # Type-check without emitting
npx prisma studio  # Open Prisma DB browser
```
