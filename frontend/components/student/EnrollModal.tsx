import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import GradientButton from "@/components/ui/GradientButton";
import { apiPost } from "@/lib/api";

interface EnrollModalProps {
  open: boolean;
  onClose: () => void;
  onEnrolled: () => void;
}

export default function EnrollModal({ open, onClose, onEnrolled }: EnrollModalProps) {
  const [courseName, setCourseName] = useState("");
  const [coursePassword, setCoursePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!courseName.trim()) {
      setError("Course name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await apiPost("/api/institutions/add_course/", {
        course_name: courseName,
        course_password: coursePassword,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.detail || data?.error || "Failed to enroll. Please check the course name and password.");
        return;
      }
      setCourseName("");
      setCoursePassword("");
      onEnrolled();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      setCourseName("");
      setCoursePassword("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "rgba(21, 27, 46, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59, 130, 246, 0.15)",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
          Enroll in Course
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
        {error && (
          <Alert severity="error" sx={{ bgcolor: "rgba(239,68,68,0.1)", color: "#f87171" }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          fullWidth
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(59,130,246,0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
          }}
        />
        <TextField
          label="Course Password"
          type="password"
          value={coursePassword}
          onChange={(e) => setCoursePassword(e.target.value)}
          fullWidth
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "rgba(59,130,246,0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <GradientButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            background: "rgba(255,255,255,0.1)",
            "&:hover": { background: "rgba(255,255,255,0.15)", boxShadow: "none" },
          }}
        >
          Cancel
        </GradientButton>
        <GradientButton onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Enroll"}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
}
