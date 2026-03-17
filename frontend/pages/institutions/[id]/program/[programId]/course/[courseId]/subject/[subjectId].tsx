import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Subject } from "../../../../../../interfaces";
import {
  Box,
  Typography,
  TextField,
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

const SubjectPage = ({ user }: { user: any }) => {
  const router = useRouter();
  const { id, programId, courseId, subjectId } = router.query;
  const [subject, setSubject] = useState<Subject>();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [visible, setVisible] = useState(true);

  const fetchSubject = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subject");
      }
      const data: Subject = await response.json();
      setSubject(data);
      setNewName(data.name);
      setDescription(data.description);
      if ((data as any).is_visible !== undefined) {
        setVisible((data as any).is_visible);
      }
    } catch (error) {
      console.error("Error fetching subject:", error);
    }
  };

  const handleEditName = () => {
    setEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update subject name");
      }
      setEditingName(false);
      router.reload();
    } catch (error) {
      console.error("Error updating subject name:", error);
    }
  };

  const handleDeleteSubject = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subject");
      }
      router.push(
        `/institutions/${id}/program/${programId}/course/${courseId}`
      );
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const res = await apiPatch(
        `/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`,
        { is_visible: !visible }
      );
      if (res.ok) {
        setVisible(!visible);
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleAddDescription = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description: newDescription }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add subject description");
      }
      const data = await response.json();
      setDescription(data.description);
      setNewDescription("");
    } catch (error) {
      console.error("Error adding subject description:", error);
    }
  };

  useEffect(() => {
    if (id && programId && courseId && subjectId) {
      fetchSubject();
    }
  }, [id, programId, courseId, subjectId]);

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
        <Link
          href={`/institutions/${id}/program/${programId}/course/${courseId}`}
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          Course
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>{subject?.name}</Typography>
      </Breadcrumbs>

      {subject && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Box>
              {editingName ? (
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    sx={darkTextFieldSx}
                  />
                  <GradientButton onClick={handleSaveName} size="small">
                    Save
                  </GradientButton>
                </Stack>
              ) : (
                <SectionHeader
                  title={`Subject: ${subject.name}`}
                  gradient
                />
              )}
            </Box>
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
              {!editingName && (
                <Button
                  variant="outlined"
                  onClick={handleEditName}
                  sx={{
                    color: "#3b82f6",
                    borderColor: "rgba(59, 130, 246, 0.3)",
                    "&:hover": {
                      borderColor: "#3b82f6",
                      background: "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  Edit Name
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={handleDeleteSubject}
                sx={{
                  color: "#ef4444",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                  "&:hover": {
                    borderColor: "#ef4444",
                    background: "rgba(239, 68, 68, 0.1)",
                  },
                }}
              >
                Delete Subject
              </Button>
            </Stack>
          </Box>

          <GlassCard sx={{ p: 3, mb: 3, mt: 2 }}>
            <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            <Typography sx={{ color: "#94a3b8", mb: 2 }}>
              {description || "No description yet."}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="New Description"
                size="small"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                sx={{ ...darkTextFieldSx, flexGrow: 1 }}
              />
              <GradientButton onClick={handleAddDescription} size="small">
                Update
              </GradientButton>
            </Stack>
          </GlassCard>
        </>
      )}
    </PageContainer>
  );
};

export default withAuth(SubjectPage, ["admin"]);
