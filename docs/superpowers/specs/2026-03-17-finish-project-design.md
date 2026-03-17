# Academ-VR: Complete Project Design Spec

## Overview

Academ-VR is a web platform for educational institutions to deliver 360° VR video content to students, organized by institution, program, course, and subject. The project has a working Django backend and partial Next.js frontend (admin and instructor dashboards). This spec covers finishing the project into a polished, portfolio-ready application.

**Goal:** Resume-worthy project that demos well live AND looks good as a GitHub repo. Every page should feel like a real product.

**Approach:** Outside-In — start with visual identity and landing page, then build each feature to that standard. Every deliverable is portfolio-ready at every stage.

**Timeline:** No hard deadline. Build it right.

---

## 1. Visual Identity & Design System

### Brand
"Academ-VR" — futuristic educational VR platform.

### Color Palette
- **Base:** Dark navy/charcoal (`#0a0f1e` to `#151b2e`)
- **Primary accent:** Electric blue (`#3b82f6`) to cyan (`#06b6d4`) gradients for CTAs and highlights
- **Secondary accent:** Soft purple (`#8b5cf6`) for progress indicators and badges
- **Text:** White/light gray hierarchy on dark backgrounds
- **Cards:** Glassmorphism — frosted glass with backdrop blur

### Typography
- Inter (or similar clean sans-serif)
- Large bold headings with gradient text on hero sections

### Component Library
- MUI as base, wrapped in a custom dark theme with the above palette
- Reusable styled components: `GlassCard`, `GradientButton`, `SectionHeader`, `StatBadge`
- Consistent border-radius, spacing, and shadow tokens

### Motion
- Framer Motion for page transitions (fade/slide)
- Hover effects on cards (slight lift + glow)
- Subtle, polished — not flashy

---

## 2. Landing Page

Single-scroll page at `/` for unauthenticated users. Authenticated users redirect to their dashboard.

### Sections

1. **Hero**
   - Headline: "Experience Learning in a New Dimension" (or similar)
   - Subtitle about immersive VR education
   - Embedded A-Frame 360° preview — interactive, drag-to-look
   - CTAs: "Get Started" (registration) and "Learn More" (scroll)
   - Aurora/gradient mesh background with subtle animated particles

2. **Features**
   - 3-4 glassmorphism cards: "360° Immersive Content", "Structured Learning Paths", "Track Your Progress", "Built for Institutions"

3. **How It Works**
   - 3-step visual: Enroll → Watch VR Content → Track Progress
   - Styled icons with connecting lines

4. **Role Showcase**
   - What each role gets: Students watch and learn, Instructors manage content, Admins run the platform

5. **Footer**
   - Login/signup links, GitHub repo link, tech stack badges (Django, Next.js, A-Frame, etc.)

### Navigation
- Sticky transparent navbar, becomes solid on scroll
- Logo left, "Login" and "Sign Up" right

---

## 3. Authentication Pages

### Login (`/auth/login`)
- Centered glass card on dark gradient background
- Email + password, gradient login button
- Links to student registration and invite signup

### Student Registration (`/auth/register`)
- Multi-step form:
  - Step 1: Name, email, password
  - Step 2: Select institution and program
  - Step 3: Enroll in courses (course password) — uses the existing `/api/institutions/add_course/` endpoint as a separate call after registration completes
- Progress indicator at top

### Admin/Instructor Invite Signup
- Same aesthetic as login
- Pre-filled email from invite token
- Clear messaging: "You've been invited to join as [Role] at [Institution]"

### Auth Guards
- HOC or Next.js middleware wrapping all dashboard routes
- Unauthenticated → redirect to login
- Wrong role → redirect to correct dashboard with toast
- Role hierarchy: admin > instructor > student

### Post-Login Routing
- Admin → `/dashboard/admin`
- Instructor → `/dashboard/instructor`
- Student → `/dashboard/student`

---

## 4. Student Dashboard & Experience

### Dashboard (`/dashboard/student`)
- Welcome header with student name and stat ("You've watched 4 of 12 videos this week")
- **My Courses** grid: glass cards with course name, program, progress bar, announcement count
- **Recent Activity** sidebar: last few videos watched with timestamps
- **Quick Enroll** button: modal to join a course with password

### Course View (`/dashboard/student/course/[courseId]`)
- Course header: name, program, instructor info
- Tab navigation: **Content** | **Announcements** | **My Progress**
- **Content tab:** Accordion subject list (read-only). Video cards with thumbnail, title, description, duration, watched/unwatched badge
- **Announcements tab:** Chronological list, pinned announcements at top
- **My Progress tab:** All videos with completion status, total progress bar, last-watched timestamps

### VR Video Player (`/dashboard/student/watch/[videoId]?course=X&subject=Y`)
- URL includes course and subject context as query params (a video can belong to multiple courses/subjects, so context determines where progress is tracked and what "Up Next" means)
- Full-width A-Frame 360° video player as hero
- Below player: title, description, course/subject breadcrumb
- **Chapter markers:** Clickable timestamps that jump to points in the video
- **Notes:** Individually saved timestamped notes per-user per-video (separate `VideoNote` model). Click a note to jump to that timestamp. Full CRUD.
- **Up Next:** Next video in the current subject (determined by subject query param), with a continue button
- Auto-mark watched at >80% viewed, or manual "Mark Complete" button

### Progress Tracking
- `VideoProgress` model tracks per-user per-video state
- Dashboard aggregates completion percentages

---

## 5. Instructor Dashboard Polish

### Visual Refresh
- Same dark theme, glassmorphism cards
- Persistent sidebar with course list (restyled)
- Top bar with instructor name, "Upload Video" quick action

### Course Management Upgrades
- Video cards show thumbnail, title, view count, assigned subjects
- Drag-and-drop reordering of videos within subjects
- Preview modal when adding videos to subjects

### Chapter Marker Editor
- Play video, click "Add Marker" at current timestamp, type label, save
- Students see these as clickable jump points
- `ChapterMarker` model: video, timestamp_seconds, label, order

### Quiz Builder
- Per-subject or per-video, instructor creates multiple-choice quizzes
- Models: `Quiz`, `Question`, `Choice`, `QuizAttempt`
- Instructor sees completion rates per quiz
- Students take quiz after watching, see their score

### Announcement Improvements
- `pinned` boolean — pinned announcements stick to top

---

## 6. Admin Dashboard Polish

### Visual Refresh
- Same dark theme
- Sidebar navigation: Institutions, Users, Invite, Analytics
- Breadcrumb navigation through institution hierarchy

### Student Management (new)
- View student list per course with progress stats
- Add/remove students from courses
- Bulk remove

### Analytics Page (new)
- Platform overview: total users by role, courses, videos
- Per-course stats: student count, avg video completion, quiz scores
- Bar/donut charts via Recharts

### User Management Improvements
- Searchable user table with role badges, institution, last active
- Actions: view details, remove from course, delete account

### Content Visibility Toggle
- `is_visible` boolean on Course and Subject models
- Instructors/admins can toggle; they see all content with a visibility indicator (eye icon / badge)
- Students only see content where `is_visible=True` — filtered server-side on list endpoints

---

## 7. Backend Additions

### New Models

```
VideoProgress
  - user (FK to User)
  - video (FK to Video)
  - course (FK to Course)
  - watched (bool)
  - progress_percent (float)
  - last_watched_at (datetime)
  - unique_together: (user, video, course)

VideoNote
  - user (FK to User)
  - video (FK to Video)
  - timestamp_seconds (int)
  - text (str, max 500)
  - created_at (datetime, auto)

ChapterMarker
  - video (FK to Video)
  - timestamp_seconds (int)
  - label (str, max 100)
  - created_by (FK to User)

Quiz
  - title (str, max 100)
  - course (FK to Course, required)
  - video (FK to Video, nullable) — optional scoping within course
  - subject (FK to Subject, nullable) — optional scoping within course
  - created_by (FK to User)
  - Constraint: at least one of video or subject should be set

Question
  - quiz (FK to Quiz)
  - text (str, max 500)
  - order (int)

Choice
  - question (FK to Question)
  - text (str, max 200)
  - is_correct (bool)

QuizAttempt
  - user (FK to User)
  - quiz (FK to Quiz)
  - score (float)
  - completed_at (datetime)

QuizAnswer
  - attempt (FK to QuizAttempt)
  - question (FK to Question)
  - selected_choice (FK to Choice)
```

### Model Changes

- `Course` — add `is_visible` (bool, default True)
- `Subject` — add `is_visible` (bool, default True)
- `Announcement` — add `pinned` (bool, default False)
- `Video` — add `duration_seconds` (int, nullable), `thumbnail` (ImageField, nullable, upload_to='thumbnails/'). Frontend accesses thumbnails via full media URL (e.g., `http://localhost:8000/media/thumbnails/...`). `VideoGetSchema` serializer updated to include the absolute thumbnail URL.

### New API Endpoints

```
Progress:
GET/POST   /api/progress/                           — student's own video progress (create/update on watch)
GET        /api/progress/course/{courseId}/           — progress for a specific course
GET        /api/progress/recent/                     — student's recent watch activity (for dashboard)

Notes:
GET/POST   /api/videos/{videoId}/notes/              — list/create notes for a video (scoped to current user)
PATCH      /api/videos/{videoId}/notes/{noteId}/     — update a note
DELETE     /api/videos/{videoId}/notes/{noteId}/     — delete a note

Chapter Markers:
GET/POST   /api/videos/{videoId}/chapters/           — list/create chapter markers
PATCH      /api/videos/{videoId}/chapters/{id}/      — update a marker label/timestamp
DELETE     /api/videos/{videoId}/chapters/{id}/      — delete a marker

Quizzes:
GET/POST   /api/quizzes/                             — list/create quizzes (filter by course_id query param)
GET/PATCH/DELETE  /api/quizzes/{quizId}/              — read/update/delete a quiz
GET/POST   /api/quizzes/{quizId}/questions/           — list/create questions
PATCH/DELETE /api/quizzes/{quizId}/questions/{qId}/   — update/delete a question
POST       /api/quizzes/{quizId}/attempt/             — submit quiz attempt (with answers)
GET        /api/quizzes/{quizId}/results/             — results (student: own with answers, instructor: all)

Analytics:
GET        /api/analytics/overview/                   — admin: total users by role, courses, videos
GET        /api/analytics/course/{courseId}/           — per-course: student count, avg completion, quiz scores

Visibility:
PATCH      /api/courses/{courseId}/visibility/         — toggle course visibility
PATCH      /api/subjects/{subjectId}/visibility/       — toggle subject visibility

Student Management:
GET        /api/courses/{courseId}/students/           — list students in course with progress stats
POST       /api/courses/{courseId}/students/           — add student to course
DELETE     /api/courses/{courseId}/students/{userId}/  — remove student from course

Video Reordering:
PATCH      /api/subjects/{subjectId}/videos/order/    — reorder videos within a subject
```

### Existing Endpoint Changes
- Course and subject list endpoints: filter by `is_visible=True` for student role; return all with `is_visible` field for instructor/admin roles
- Announcement list endpoint: sort pinned announcements to top
- `VideoGetSchema` serializer: include `thumbnail` URL and `duration_seconds`

### Security
- Auth guard middleware — verify JWT on protected routes
- Role-based permissions on all new endpoints
- Enable CSRF protection for JWT cookies — this requires a frontend change: add a fetch/axios wrapper that reads the CSRF token from the cookie and includes it in request headers (this is an explicit build step, not just a config toggle)

### Existing Fixes (already applied)
- Migration conflicts merged
- `django-sage-streaming` patched for Django 5.x compatibility
- `index.tsx` duplicate variable bug fixed

---

## 8. Tech Stack

### Frontend Changes
- **Add:** A-Frame (VR player), Framer Motion (animations), Recharts (charts), next/font with Inter
- **Remove:** react-vr-player

### Backend Changes
- **Add:** Pillow (thumbnail handling)

### No Changes
- Next.js 14 (Pages Router)
- Django >=5.0.2,<5.2 + DRF
- SQLite (fine for portfolio)
- MUI (stays as component base, heavily themed)
- Tailwind CSS (kept for utility classes alongside MUI — already installed and configured)

---

## 9. Build Order

Following the Outside-In approach:

1. **Visual identity** — MUI dark theme, reusable components (GlassCard, GradientButton, etc.), Framer Motion setup, Inter font
2. **Landing page** — hero with A-Frame preview, features, how-it-works, role showcase, footer, sticky navbar
3. **Auth pages** — login reskin, multi-step student registration, invite signup reskin, auth guards (HOC/middleware), CSRF token handling in fetch wrapper
4. **Student dashboard + VR player** — course grid, course view with tabs, A-Frame 360° player, VideoProgress backend model, manual "Mark Complete" button. Built together because the dashboard's progress display depends on the player's completion tracking.
5. **Notes + chapter markers** — VideoNote model + CRUD, ChapterMarker model + CRUD, instructor marker editor, student note-taking in player
6. **Quiz system** — Quiz/Question/Choice/QuizAttempt/QuizAnswer models, instructor quiz builder UI, student quiz-taking, results view
7. **Instructor dashboard polish** — reskin to dark theme, drag-and-drop video reorder, video preview modals, pinned announcements
8. **Admin dashboard polish** — reskin to dark theme, student management (list/add/remove), analytics page (Recharts), content visibility toggles, searchable user table
9. **Demo data + final polish** — update seed_db command with realistic demo data (sample progress, quiz attempts, chapter markers, notes), page transitions, edge cases, README rewrite with screenshots, tech stack badges
