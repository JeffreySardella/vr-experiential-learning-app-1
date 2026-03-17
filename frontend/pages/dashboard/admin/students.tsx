import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { withAuth } from "@/lib/auth";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    "& fieldset": { borderColor: "rgba(59, 130, 246, 0.2)" },
    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

const darkSelectSx = {
  color: "#f1f5f9",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3b82f6",
  },
  "& .MuiSvgIcon-root": { color: "#94a3b8" },
};

const tableCellSx = {
  color: "#f1f5f9",
  borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
};

const tableHeaderSx = {
  ...tableCellSx,
  fontWeight: 600,
  color: "#94a3b8",
  fontSize: "0.8rem",
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};

interface CourseOption {
  id: number;
  name: string;
}

interface Student {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  videos_watched?: number;
  progress?: number;
}

const StudentManagement = ({ user }: { user: any }) => {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | "">("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Fetch all courses from institutions
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const instRes = await apiGet("/api/institutions/");
        if (!instRes.ok) return;
        const institutions = await instRes.json();
        const allCourses: CourseOption[] = [];

        for (const inst of institutions) {
          const progRes = await apiGet(
            `/api/institutions/${inst.id}/programs/`
          );
          if (!progRes.ok) continue;
          const programs = await progRes.json();
          for (const prog of programs) {
            const courseRes = await apiGet(
              `/api/institutions/${inst.id}/programs/${prog.id}/courses/`
            );
            if (!courseRes.ok) continue;
            const coursesData = await courseRes.json();
            for (const c of coursesData) {
              allCourses.push({ id: c.id, name: c.name });
            }
          }
        }

        setCourses(allCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students when course changes
  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await apiGet(`/api/courses/${selectedCourseId}/students/`);
        if (res.ok) {
          const data = await res.json();
          setStudents(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
      setLoading(false);
    };

    fetchStudents();
  }, [selectedCourseId]);

  const handleAddStudent = async () => {
    if (!addEmail.trim() || !selectedCourseId) return;

    setAddError("");
    setAddSuccess("");

    try {
      // First find the user by email
      const userRes = await apiGet(`/api/users/${addEmail.trim()}`);
      if (!userRes.ok) {
        setAddError("Could not find user with that email.");
        return;
      }
      const userData = await userRes.json();
      if (!userData.pk) {
        setAddError("User not found.");
        return;
      }

      // Add user to course
      const res = await apiPost(`/api/courses/${selectedCourseId}/users`, {
        user_id: userData.pk,
      });

      if (res.ok || res.status === 204) {
        setAddSuccess("Student added successfully.");
        setAddEmail("");
        // Refresh student list
        const studentsRes = await apiGet(
          `/api/courses/${selectedCourseId}/students/`
        );
        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(Array.isArray(data) ? data : []);
        }
      } else {
        const errorData = await res.json();
        setAddError(
          typeof errorData === "string"
            ? errorData
            : JSON.stringify(errorData)
        );
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setAddError("Failed to add student.");
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedCourseId) return;

    try {
      await apiDelete(
        `/api/courses/${selectedCourseId}/users/${studentId}`
      );
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <SectionHeader
        title="Student Management"
        subtitle="Manage student enrollments across courses"
        gradient
      />

      {/* Course Selector */}
      <GlassCard sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel
            sx={{ color: "#94a3b8", "&.Mui-focused": { color: "#3b82f6" } }}
          >
            Select a Course
          </InputLabel>
          <Select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value as number)}
            input={<OutlinedInput label="Select a Course" />}
            sx={darkSelectSx}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GlassCard>

      {selectedCourseId && (
        <>
          {/* Add Student */}
          <GlassCard sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
            >
              Add Student to Course
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Student Email"
                size="small"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                sx={{ ...darkTextFieldSx, flexGrow: 1 }}
                type="email"
              />
              <GradientButton onClick={handleAddStudent}>
                Add Student
              </GradientButton>
            </Stack>
            {addError && (
              <Typography variant="body2" sx={{ color: "#ef4444", mt: 1 }}>
                {addError}
              </Typography>
            )}
            {addSuccess && (
              <Typography variant="body2" sx={{ color: "#22c55e", mt: 1 }}>
                {addSuccess}
              </Typography>
            )}
          </GlassCard>

          {/* Students Table */}
          <GlassCard sx={{ overflow: "hidden" }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 4,
                }}
              >
                <CircularProgress sx={{ color: "#3b82f6" }} />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableHeaderSx}>Name</TableCell>
                      <TableCell sx={tableHeaderSx}>Email</TableCell>
                      <TableCell sx={tableHeaderSx}>Videos Watched</TableCell>
                      <TableCell sx={tableHeaderSx}>Progress</TableCell>
                      <TableCell sx={tableHeaderSx} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow
                        key={student.id}
                        sx={{
                          "&:hover": {
                            background: "rgba(59, 130, 246, 0.05)",
                          },
                        }}
                      >
                        <TableCell sx={tableCellSx}>
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell sx={tableCellSx}>
                          {student.email}
                        </TableCell>
                        <TableCell sx={tableCellSx}>
                          {student.videos_watched ?? 0}
                        </TableCell>
                        <TableCell sx={tableCellSx}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={student.progress ?? 0}
                              sx={{
                                flexGrow: 1,
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: "rgba(59, 130, 246, 0.1)",
                                "& .MuiLinearProgress-bar": {
                                  background:
                                    "linear-gradient(135deg, #3b82f6, #06b6d4)",
                                  borderRadius: 3,
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: "#94a3b8", minWidth: 40 }}
                            >
                              {student.progress ?? 0}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={tableCellSx} align="right">
                          <IconButton
                            onClick={() => handleRemoveStudent(student.id)}
                            size="small"
                            sx={{
                              color: "#ef4444",
                              "&:hover": {
                                background: "rgba(239, 68, 68, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {students.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            ...tableCellSx,
                            textAlign: "center",
                            py: 4,
                            color: "#94a3b8",
                          }}
                        >
                          No students enrolled in this course.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </GlassCard>
        </>
      )}
    </PageContainer>
  );
};

export default withAuth(StudentManagement, ["admin"]);
