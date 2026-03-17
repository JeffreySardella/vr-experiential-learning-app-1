import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { withAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import StatBadge from "@/components/ui/StatBadge";

const CHART_COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

interface OverviewData {
  users?: {
    total?: number;
    students?: number;
    instructors?: number;
    admins?: number;
  };
  courses?: number;
  videos?: number;
}

interface CourseStats {
  name: string;
  student_count: number;
  video_count?: number;
}

const Analytics = ({ user }: { user: any }) => {
  const [overview, setOverview] = useState<OverviewData>({});
  const [courseStats, setCourseStats] = useState<CourseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch overview
        const overviewRes = await apiGet("/api/analytics/overview/");
        if (overviewRes.ok) {
          const data = await overviewRes.json();
          setOverview(data);
        }

        // Fetch institutions to get courses
        const instRes = await apiGet("/api/institutions/");
        if (instRes.ok) {
          const institutions = await instRes.json();
          const allCourseStats: CourseStats[] = [];

          for (const inst of institutions) {
            const progRes = await apiGet(
              `/api/institutions/${inst.id}/programs/`
            );
            if (progRes.ok) {
              const programs = await progRes.json();
              for (const prog of programs) {
                const courseRes = await apiGet(
                  `/api/institutions/${inst.id}/programs/${prog.id}/courses/`
                );
                if (courseRes.ok) {
                  const courses = await courseRes.json();
                  for (const course of courses) {
                    // Try to get per-course stats
                    try {
                      const statsRes = await apiGet(
                        `/api/courses/${course.id}/students/`
                      );
                      if (statsRes.ok) {
                        const students = await statsRes.json();
                        allCourseStats.push({
                          name: course.name,
                          student_count: Array.isArray(students)
                            ? students.length
                            : 0,
                        });
                      } else {
                        allCourseStats.push({
                          name: course.name,
                          student_count: 0,
                        });
                      }
                    } catch {
                      allCourseStats.push({
                        name: course.name,
                        student_count: 0,
                      });
                    }
                  }
                }
              }
            }
          }

          setCourseStats(allCourseStats);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const roleData = [
    { name: "Students", value: overview.users?.students || 0 },
    { name: "Instructors", value: overview.users?.instructors || 0 },
    { name: "Admins", value: overview.users?.admins || 0 },
  ].filter((d) => d.value > 0);

  if (loading) {
    return (
      <PageContainer sx={{ background: "#0a0f1e" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <SectionHeader
        title="Analytics Dashboard"
        subtitle="Platform-wide statistics and insights"
        gradient
      />

      {/* Stat Badges Row */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
        <StatBadge label="Students" value={overview.users?.students || 0} color="primary" />
        <StatBadge label="Instructors" value={overview.users?.instructors || 0} color="secondary" />
        <StatBadge label="Admins" value={overview.users?.admins || 0} color="info" />
        <StatBadge label="Courses" value={overview.courses || 0} color="primary" />
        <StatBadge label="Videos" value={overview.videos || 0} color="secondary" />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Bar Chart - Students per Course */}
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
            >
              Students per Course
            </Typography>
            {courseStats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseStats}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(59, 130, 246, 0.2)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(21, 27, 46, 0.95)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Bar dataKey="student_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
                No course data available.
              </Typography>
            )}
          </GlassCard>
        </Grid>

        {/* Pie Chart - Users by Role */}
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
            >
              Users by Role
            </Typography>
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(21, 27, 46, 0.95)",
                      border: "1px solid rgba(59, 130, 246, 0.2)",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
                No user data available.
              </Typography>
            )}
          </GlassCard>
        </Grid>
      </Grid>

      {/* Per-course Stats Cards */}
      {courseStats.length > 0 && (
        <>
          <Typography
            variant="h6"
            sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
          >
            Per-Course Details
          </Typography>
          <Grid container spacing={2}>
            {courseStats.map((course, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <GlassCard sx={{ p: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1 }}
                  >
                    {course.name}
                  </Typography>
                  <StatBadge
                    label="students"
                    value={course.student_count}
                    color="primary"
                  />
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </PageContainer>
  );
};

export default withAuth(Analytics, ["admin"]);
