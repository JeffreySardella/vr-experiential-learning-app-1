import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Program, Course } from "../../interfaces";
import {
  Box,
  Typography,
  TextField,
  Grid,
  CardContent,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import ClassIcon from "@mui/icons-material/Class";

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

const ProgramPage = ({ user }: { user: any }) => {
  const router = useRouter();
  const { id, programId } = router.query;
  const [program, setProgram] = useState<Program>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAddCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      fetchCourses();
      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProgram = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}`
      );
      const data: Program = await response.json();
      setProgram(data);
    } catch (error) {
      console.error("Error fetching program:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/`
      );
      const data: Course[] = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (id && programId) {
      fetchProgram();
      fetchCourses();
    }
  }, [id, programId]);

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Breadcrumbs sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "#94a3b8" } }}>
        <Link href="/dashboard/admin" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link href="/institutions" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Institutions
        </Link>
        <Link href={`/institutions/${id}`} style={{ color: "#3b82f6", textDecoration: "none" }}>
          Institution
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>{program?.name}</Typography>
      </Breadcrumbs>

      <SectionHeader title={`Program: ${program?.name || ""}`} gradient />

      <Typography
        variant="h6"
        sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2, mt: 2 }}
      >
        Courses
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <GlassCard
              glow
              sx={{ cursor: "pointer" }}
              onClick={() =>
                router.push(
                  `/institutions/${id}/program/${programId}/course/${course.id}`
                )
              }
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(139, 92, 246, 0.15)",
                    mb: 2,
                  }}
                >
                  <ClassIcon sx={{ color: "#8b5cf6" }} />
                </Box>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {course.name}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 3, maxWidth: 500 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
        >
          Add Course
        </Typography>
        <form onSubmit={handleAddCourse}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Course Name"
              size="small"
              value={name}
              onChange={handleNameChange}
              sx={{ ...darkTextFieldSx, flexGrow: 1 }}
            />
            <GradientButton type="submit">Create</GradientButton>
          </Stack>
        </form>
      </GlassCard>
    </PageContainer>
  );
};

export default withAuth(ProgramPage, ["admin"]);
