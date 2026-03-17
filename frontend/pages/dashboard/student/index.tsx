import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Stack,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { withAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import StatBadge from "@/components/ui/StatBadge";
import EnrollModal from "@/components/student/EnrollModal";

interface Course {
  id: number;
  name: string;
  program_name?: string;
  program?: { name: string };
}

interface ProgressEntry {
  video: number;
  course: number;
  watched: boolean;
  progress_percent: number;
  video_title?: string;
  course_name?: string;
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

function StudentDashboard({ user }: { user: UserData }) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recent, setRecent] = useState<ProgressEntry[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, ProgressEntry[]>>({});
  const [enrollOpen, setEnrollOpen] = useState(false);

  const fetchData = async () => {
    try {
      const coursesRes = await apiGet("/api/institutions/courses/");
      if (coursesRes.ok) {
        const coursesData: Course[] = await coursesRes.json();
        setCourses(coursesData);

        const progressEntries: Record<number, ProgressEntry[]> = {};
        await Promise.all(
          coursesData.map(async (course) => {
            const progRes = await apiGet(`/api/video/progress/course/${course.id}/`);
            if (progRes.ok) {
              progressEntries[course.id] = await progRes.json();
            }
          })
        );
        setProgressMap(progressEntries);
      }

      const recentRes = await apiGet("/api/video/progress/recent/");
      if (recentRes.ok) {
        setRecent(await recentRes.json());
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCourseProgress = (courseId: number): number => {
    const entries = progressMap[courseId];
    if (!entries || entries.length === 0) return 0;
    const total = entries.length;
    const completed = entries.filter((e) => e.watched).length;
    return Math.round((completed / total) * 100);
  };

  const totalCourses = courses.length;
  const completedVideos = Object.values(progressMap)
    .flat()
    .filter((e) => e.watched).length;
  const totalVideos = Object.values(progressMap).flat().length;

  return (
    <PageContainer>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome back, {user.first_name}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <StatBadge label="Courses" value={totalCourses} color="primary" />
          <StatBadge label="Videos Completed" value={completedVideos} color="secondary" />
          <StatBadge label="Total Videos" value={totalVideos} color="info" />
          <Box sx={{ ml: "auto" }}>
            <GradientButton onClick={() => setEnrollOpen(true)}>+ Enroll in Course</GradientButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Courses Column */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
            My Courses
          </Typography>
          <Grid container spacing={2}>
            {courses.map((course) => {
              const progress = getCourseProgress(course.id);
              return (
                <Grid item xs={12} sm={6} key={course.id}>
                  <Link href={`/dashboard/student/course/${course.id}`} style={{ textDecoration: "none" }}>
                    <GlassCard
                      glow
                      sx={{ cursor: "pointer" }}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 0.5 }}>
                          {course.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}>
                          {course.program_name || course.program?.name || ""}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "rgba(255,255,255,0.08)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                              },
                            }}
                          />
                          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", minWidth: 32 }}>
                            {progress}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </GlassCard>
                  </Link>
                </Grid>
              );
            })}
            {courses.length === 0 && (
              <Grid item xs={12}>
                <GlassCard>
                  <CardContent>
                    <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                      No courses yet. Enroll in a course to get started!
                    </Typography>
                  </CardContent>
                </GlassCard>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Recent Activity Column */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
            Recent Activity
          </Typography>
          <Stack spacing={2}>
            {recent.map((entry, idx) => (
              <GlassCard key={idx}>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#fff" }}>
                    {entry.video_title || `Video ${entry.video}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
                    {entry.course_name || `Course ${entry.course}`}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={entry.progress_percent}
                    sx={{
                      mt: 1,
                      height: 4,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.08)",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 2,
                        background: entry.watched
                          ? "linear-gradient(90deg, #22c55e, #16a34a)"
                          : "linear-gradient(90deg, #3b82f6, #06b6d4)",
                      },
                    }}
                  />
                </CardContent>
              </GlassCard>
            ))}
            {recent.length === 0 && (
              <GlassCard>
                <CardContent>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                    No recent activity yet.
                  </Typography>
                </CardContent>
              </GlassCard>
            )}
          </Stack>
        </Grid>
      </Grid>

      <EnrollModal open={enrollOpen} onClose={() => setEnrollOpen(false)} onEnrolled={fetchData} />
    </PageContainer>
  );
}

export default withAuth(StudentDashboard, ["student"]);
