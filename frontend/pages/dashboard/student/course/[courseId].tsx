import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Chip,
  CardContent,
  Stack,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { withAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import GlassCard from "@/components/ui/GlassCard";

interface Video {
  id: number;
  title: string;
  description?: string;
}

interface Subject {
  id: number;
  name: string;
  videos: Video[];
}

interface Course {
  id: number;
  name: string;
  description?: string;
  program_name?: string;
  subjects?: Subject[];
  videos?: Video[];
}

interface ProgressEntry {
  video: number;
  course: number;
  watched: boolean;
  progress_percent: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
}

interface UserData {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: { name: string }[];
  institution: number | null;
  programs: number[];
  courses: number[];
}

function StudentCourseView({ user }: { user: UserData }) {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      try {
        const [courseRes, progressRes, announcementsRes] = await Promise.all([
          apiGet(`/api/courses/${courseId}`),
          apiGet(`/api/video/progress/course/${courseId}/`),
          apiGet(`/api/institutions/course/${courseId}/announcements`),
        ]);

        if (courseRes.ok) setCourse(await courseRes.json());
        if (progressRes.ok) setProgress(await progressRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
      } catch (err) {
        console.error("Failed to fetch course data:", err);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const isWatched = (videoId: number): boolean => {
    return progress.some((p) => p.video === videoId && p.watched);
  };

  const getVideoProgress = (videoId: number): number => {
    const entry = progress.find((p) => p.video === videoId);
    return entry?.progress_percent ?? 0;
  };

  const allVideos: Video[] = course?.subjects
    ? course.subjects.flatMap((s) => s.videos || [])
    : course?.videos || [];

  const overallProgress =
    allVideos.length > 0
      ? Math.round((allVideos.filter((v) => isWatched(v.id)).length / allVideos.length) * 100)
      : 0;

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (!course) {
    return (
      <PageContainer>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <Typography color="text.secondary">Loading course...</Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.push("/dashboard/student")} sx={{ color: "#3b82f6" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {course.name}
          </Typography>
          {course.description && (
            <Typography variant="body2" color="text.secondary">
              {course.description}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          "& .MuiTab-root": { color: "rgba(255,255,255,0.5)", fontWeight: 600 },
          "& .Mui-selected": { color: "#3b82f6" },
          "& .MuiTabs-indicator": {
            background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
          },
        }}
      >
        <Tab label="Content" />
        <Tab label="Announcements" />
        <Tab label="My Progress" />
      </Tabs>

      {/* Content Tab */}
      {tab === 0 && (
        <Box>
          {course.subjects && course.subjects.length > 0 ? (
            course.subjects.map((subject) => (
              <Accordion
                key={subject.id}
                defaultExpanded
                sx={{
                  bgcolor: "rgba(21, 27, 46, 0.6)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px !important",
                  mb: 2,
                  "&:before": { display: "none" },
                  "& .MuiAccordionSummary-root": { minHeight: 56 },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#3b82f6" }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff" }}>
                    {subject.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {(subject.videos || []).map((video) => {
                      const watched = isWatched(video.id);
                      return (
                        <GlassCard
                          key={video.id}
                          sx={{
                            cursor: "pointer",
                            "&:hover": { bgcolor: "rgba(59,130,246,0.08)" },
                          }}
                          onClick={() =>
                            router.push(
                              `/dashboard/student/watch/${video.id}?course=${courseId}&subject=${subject.id}`
                            )
                          }
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              py: 1.5,
                              "&:last-child": { pb: 1.5 },
                            }}
                          >
                            {watched ? (
                              <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 28 }} />
                            ) : (
                              <PlayCircleIcon sx={{ color: "#3b82f6", fontSize: 28 }} />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: "#fff" }}>
                                {video.title}
                              </Typography>
                              {video.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {video.description}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                              {getVideoProgress(video.id)}%
                            </Typography>
                          </CardContent>
                        </GlassCard>
                      );
                    })}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <GlassCard>
              <CardContent>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                  No content available yet.
                </Typography>
              </CardContent>
            </GlassCard>
          )}
        </Box>
      )}

      {/* Announcements Tab */}
      {tab === 1 && (
        <Stack spacing={2}>
          {sortedAnnouncements.length > 0 ? (
            sortedAnnouncements.map((ann) => (
              <GlassCard key={ann.id}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", flex: 1 }}>
                      {ann.title}
                    </Typography>
                    {ann.pinned && (
                      <Chip
                        label="Pinned"
                        size="small"
                        sx={{
                          bgcolor: "rgba(59,130,246,0.2)",
                          color: "#60a5fa",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
                    {ann.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(ann.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                </CardContent>
              </GlassCard>
            ))
          ) : (
            <GlassCard>
              <CardContent>
                <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                  No announcements yet.
                </Typography>
              </CardContent>
            </GlassCard>
          )}
        </Stack>
      )}

      {/* Progress Tab */}
      {tab === 2 && (
        <Box>
          <GlassCard sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 2 }}>
                Overall Progress
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={overallProgress}
                  sx={{
                    flex: 1,
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                    },
                  }}
                />
                <Typography variant="h6" sx={{ color: "#60a5fa", fontWeight: 700, minWidth: 50 }}>
                  {overallProgress}%
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 1 }}>
                {allVideos.filter((v) => isWatched(v.id)).length} of {allVideos.length} videos completed
              </Typography>
            </CardContent>
          </GlassCard>

          <Stack spacing={1}>
            {allVideos.map((video) => {
              const watched = isWatched(video.id);
              const prog = getVideoProgress(video.id);
              return (
                <GlassCard key={video.id}>
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      py: 1.5,
                      "&:last-child": { pb: 1.5 },
                    }}
                  >
                    {watched ? (
                      <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 24 }} />
                    ) : (
                      <PlayCircleIcon sx={{ color: "#3b82f6", fontSize: 24 }} />
                    )}
                    <Typography variant="body1" sx={{ color: "#fff", flex: 1 }}>
                      {video.title}
                    </Typography>
                    <Box sx={{ width: 120, display: "flex", alignItems: "center", gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={prog}
                        sx={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          bgcolor: "rgba(255,255,255,0.08)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 2,
                            background: watched
                              ? "linear-gradient(90deg, #22c55e, #16a34a)"
                              : "linear-gradient(90deg, #3b82f6, #06b6d4)",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", minWidth: 32 }}>
                        {prog}%
                      </Typography>
                    </Box>
                  </CardContent>
                </GlassCard>
              );
            })}
          </Stack>
        </Box>
      )}
    </PageContainer>
  );
}

export default withAuth(StudentCourseView, ["student"]);
