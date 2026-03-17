# Chunk 6 Full Implementation Code

This file contains the complete implementation code for Tasks 26-28c (Student Dashboard, Course View, VR Player, Chapter Markers, Video Notes, Watch Page).

See the main plan at `docs/superpowers/plans/2026-03-17-finish-academ-vr.md` for task context and commit instructions.

---

## Task 26: EnrollModal Component

File: `frontend/components/student/EnrollModal.tsx`

- Dialog with course name + password fields
- Calls `apiPost("/api/institutions/add_course/", { course_name, course_password })`
- Props: `open`, `onClose`, `onEnrolled` callbacks
- Uses dark-themed Dialog PaperProps with glassmorphism styling
- Error state for failed enrollment attempts

## Task 26: Student Dashboard Page

File: `frontend/pages/dashboard/student/index.tsx`

Key implementation details:

- Wrapped with `withAuth(StudentDashboard, ["student"])`
- User prop provides `first_name` and `courses` array
- On mount, fetches courses from `/api/institutions/courses/`, recent activity from `/api/video/progress/recent/`, and progress per course
- `progressMap` state: `Record<number, ProgressItem[]>` keyed by courseId
- `getCourseProgress(courseId)`: counts watched items / total from progressMap, returns percentage
- Layout: PageContainer > welcome header Box > Grid (8-col courses, 4-col recent)
- Course cards: GlassCard with glow, onClick navigates to `/dashboard/student/course/{id}`
- Each card shows: course.name, course.program.name, LinearProgress bar with gradient
- Recent activity: Stack of small GlassCards, onClick navigates to watch page
- EnrollModal toggled by state, onEnrolled triggers re-fetch

## Task 27: Student Course View

File: `frontend/pages/dashboard/student/course/[courseId].tsx`

Key implementation details:

- Wrapped with `withAuth(StudentCourseView, ["student"])`
- Reads `courseId` from `router.query`
- Fetches: `/api/courses/{courseId}` (course data), `/api/video/progress/course/{courseId}/` (progress), `/api/institutions/course/{courseId}/announcements` (announcements)
- Three Tabs: Content (0), Announcements (1), My Progress (2)
- Helpers: `isWatched(videoId)` checks progress array, `getPercent(videoId)` gets progress_percent
- Content tab: Accordion per subject, VideoCard sub-component per video. VideoCard shows CheckCircleIcon (green, #22c55e) if watched, PlayCircleIcon (blue, #3b82f6) if not. onClick navigates to watch page with course/subject query params.
- Announcements tab: sort pinned first then by date desc. GlassCard per announcement with Chip for "Pinned".
- Progress tab: GlassCard with overall LinearProgress, list of all videos with status

## Task 28: VRPlayer Component

File: `frontend/components/player/VRPlayer.tsx`

Key implementation details:

- Props: `videoSrc: string`, `onTimeUpdate?: (seconds: number) => void`, `onProgress?: (percent: number) => void`, `seekTo?: number | null`
- Uses refs: `videoRef` for HTMLVideoElement, `sceneRef` for container div, `aframeLoaded` boolean ref
- Load A-Frame: useEffect loads `https://aframe.io/releases/1.5.0/aframe.min.js` via script tag, sets aframeLoaded.current = true on load, then calls renderScene()
- renderScene function: uses safe DOM APIs (document.createElement) to build A-Frame scene:
  - Clear existing children with while(firstChild) removeChild loop
  - Create `a-scene` element with attributes: embedded, vr-mode-ui="enabled: false", style height 500px
  - Create `a-videosphere` with id="vr-video", src="#vr-video-src", rotation="0 -90 0"
  - Create `a-camera` with wasd-controls-enabled="false"
  - Append videosphere and camera to scene, scene to container
- Hidden video element: `<video ref={videoRef} id="vr-video-src" src={videoSrc} crossOrigin="anonymous" loop playsInline onTimeUpdate={handleTimeUpdate} style={{ display: "none" }} />`
- seekTo useEffect: when seekTo changes and is not null, set videoRef.current.currentTime = seekTo
- Controls overlay: Box with play/pause IconButton and Slider for seek position

## Task 28b: ChapterMarkers Component

File: `frontend/components/player/ChapterMarkers.tsx`

Key implementation details:

- Props: `videoId: number`, `currentTime: number`, `onSeek: (seconds: number) => void`
- Fetches markers from `apiGet("/api/video/{videoId}/chapters/")` on mount
- Returns null if no markers
- formatTime helper: `Math.floor(s/60) + ":" + (s%60).toString().padStart(2, "0")`
- Active chapter index: `markers.reduce((acc, m, i) => m.timestamp_seconds <= currentTime ? i : acc, -1)`
- Renders horizontal Stack of Chips, active chip has brighter background and border
- Each Chip onClick calls onSeek(marker.timestamp_seconds)

## Task 28b: VideoNotes Component

File: `frontend/components/player/VideoNotes.tsx`

Key implementation details:

- Props: `videoId: number`, `currentTime: number`, `onSeek: (seconds: number) => void`
- State: `notes` array, `newText` string
- fetchNotes: `apiGet("/api/video/{videoId}/notes/")`
- addNote: `apiPost("/api/video/{videoId}/notes/", { timestamp_seconds: currentTime, text: newText })`, then clear and refetch
- deleteNote: `apiDelete("/api/video/{videoId}/notes/{noteId}/")`, then refetch
- GlassCard with "My Notes" title, scrollable list (maxHeight 300), add form at bottom
- Each note: timestamp Button (onClick calls onSeek), text Typography, delete IconButton
- Add form: timestamp caption (formatTime of currentTime), TextField (Enter key triggers add), "Add" Button

## Task 28c: Watch Video Page

File: `frontend/pages/dashboard/student/watch/[videoId].tsx`

Key implementation details:

- Wrapped with `withAuth(WatchVideoPage, ["student"])`
- Reads `videoId` from router.query, `course` and `subject` from query params
- State: `video` (VideoData), `currentTime` (number, 0), `seekTo` (number|null), `markedComplete` (boolean), `maxProgress` (number, 0)
- Fetches video from `apiGet("/api/video/{videoId}/")`
- updateProgress: `apiPost("/api/video/progress/", { video: Number(videoId), course: Number(courseId), progress_percent, watched })`
- handleProgress callback: tracks maxProgress, auto-marks at 80%
- handleMarkComplete: posts 100% progress manually
- handleSeek: sets seekTo, clears after 100ms
- videoSrc: `process.env.API_URL + "/" + video.video`
- Layout: PageContainer (maxWidth xl), Breadcrumbs (Dashboard > Course > Title), VRPlayer full width, ChapterMarkers below, Grid (7-col title/description/complete button, 5-col VideoNotes)
