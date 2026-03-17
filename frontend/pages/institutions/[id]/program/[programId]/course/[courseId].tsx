import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Subject } from "@/pages/institutions/interfaces";
import {
  Box,
  Typography,
  TextField,
  Grid,
  CardContent,
  Breadcrumbs,
  Stack,
  Button,
} from "@mui/material";
import { withAuth } from "@/lib/auth";
import { apiPatch } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import SubjectIcon from "@mui/icons-material/Subject";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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

const CoursePage = ({ user }: { user: any }) => {
  const router = useRouter();
  const { id, programId, courseId } = router.query;
  const [course, setCourse] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState<any>(false);
  const [btnContent, setBtnContent] = useState<any>("Add");
  const [visible, setVisible] = useState(true);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      router.push(`/institutions/${id}/program/${programId}/`);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const res = await apiPatch(
        `/api/institutions/${id}/programs/${programId}/courses/${courseId}`,
        { is_visible: !visible }
      );
      if (res.ok) {
        setVisible(!visible);
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
        if (data.is_visible !== undefined) {
          setVisible(data.is_visible);
        }
      } else {
        console.error("Failed to fetch course:", response.status);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/add_course?course_id=${courseId}`,
        { credentials: "include" }
      );
      if (response.ok) {
        const data = await response.text();
        if (data == "true") {
          setFlag(true);
          setBtnContent("Added");
        } else {
          setFlag(false);
          setBtnContent("Add");
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const handleAddCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.API_URL}/api/institutions/add_course/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ course_id: courseId }),
      });
      fetchCourse();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add subject");
      }
      fetchSubjects();
      setName("");
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    if (id && programId && courseId) {
      fetchCourse();
      fetchSubjects();
    }
  }, [id, programId, courseId]);

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
        <Link
          href={`/institutions/${id}/program/${programId}`}
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          Program
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>{course?.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <SectionHeader title={`Course: ${course?.name || ""}`} gradient />
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            onClick={handleToggleVisibility}
            sx={{
              color: visible ? "#22c55e" : "#94a3b8",
              borderColor: visible ? "rgba(34, 197, 94, 0.3)" : "rgba(148, 163, 184, 0.3)",
              "&:hover": {
                borderColor: visible ? "#22c55e" : "#94a3b8",
                background: visible ? "rgba(34, 197, 94, 0.1)" : "rgba(148, 163, 184, 0.1)",
              },
            }}
          >
            {visible ? "Visible" : "Hidden"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteCourse}
            sx={{
              color: "#ef4444",
              borderColor: "rgba(239, 68, 68, 0.3)",
              "&:hover": {
                borderColor: "#ef4444",
                background: "rgba(239, 68, 68, 0.1)",
              },
            }}
          >
            Delete Course
          </Button>
        </Stack>
      </Box>

      <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2, mt: 2 }}>
        Subjects
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject.id}>
            <GlassCard
              glow
              sx={{ cursor: "pointer" }}
              onClick={() =>
                router.push(
                  `/institutions/${id}/program/${programId}/course/${courseId}/subject/${subject.id}`
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
                    background: "rgba(6, 182, 212, 0.15)",
                    mb: 2,
                  }}
                >
                  <SubjectIcon sx={{ color: "#06b6d4" }} />
                </Box>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {subject.name}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 3, maxWidth: 500, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}>
          Add Subject
        </Typography>
        <form onSubmit={handleAddSubject}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Subject Name"
              size="small"
              value={name}
              onChange={handleNameChange}
              sx={{ ...darkTextFieldSx, flexGrow: 1 }}
            />
            <GradientButton type="submit">Create</GradientButton>
          </Stack>
        </form>
      </GlassCard>

      <form onSubmit={handleAddCourse}>
        <GradientButton
          type="submit"
          disabled={flag}
          sx={{
            opacity: flag ? 0.5 : 1,
          }}
        >
          {btnContent}
        </GradientButton>
      </form>
    </PageContainer>
  );
};

export default withAuth(CoursePage, ["admin"]);
