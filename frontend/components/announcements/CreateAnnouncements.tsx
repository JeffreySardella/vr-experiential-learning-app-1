import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
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

export default function CreateAnnouncements({ courseId, setDisplay }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const announcementData = {
      title: title,
      body: content,
    };

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/course/${courseId}/announcements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      setTitle("");
      setContent("");
      setError(null);
      setDisplay("announcements");
    } catch (error) {
      console.error("Error creating announcement:", error);
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#f1f5f9",
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Create Announcement
        </Typography>

        <GlassCard sx={{ p: 3, width: "100%" }}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={darkTextFieldSx}
            />

            <TextField
              fullWidth
              multiline
              minRows={6}
              placeholder="Announcement Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ ...darkTextFieldSx, mt: 2, mb: 2 }}
            />

            {error && (
              <Typography
                variant="body2"
                color="error"
                align="center"
                gutterBottom
              >
                {error}
              </Typography>
            )}

            <GradientButton type="submit" fullWidth>
              Create
            </GradientButton>
          </form>
        </GlassCard>
      </Box>
    </Container>
  );
}
