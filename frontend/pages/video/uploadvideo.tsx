import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadVideo = ({ user }: { user: any }) => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/video/uploadvideo/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }
      setTitle("");
      setDescription("");
      setName("");
      setFile(undefined);
      setSuccessMessage("Video uploaded successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error uploading video", error);
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const handleUpload = async (event: any) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };
    if (target.files != null) {
      setFile(target.files[0]);
      setName(target.files[0].name);
    }
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Box sx={{ maxWidth: 560, mx: "auto", mt: 4 }}>
        <SectionHeader title="Upload Video" gradient align="center" />

        <GlassCard sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="Title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              sx={darkTextFieldSx}
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              required
              id="description"
              label="Description"
              name="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              sx={{ ...darkTextFieldSx, mt: 2 }}
            />

            <Box sx={{ mt: 2, mb: 1 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onChange={handleUpload}
                sx={{
                  color: "#3b82f6",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  "&:hover": {
                    borderColor: "#3b82f6",
                    background: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Choose File
                <VisuallyHiddenInput type="file" accept="video/*" />
              </Button>
            </Box>

            {name && (
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 1 }}>
                Selected: {name}
              </Typography>
            )}

            <GradientButton type="submit" fullWidth sx={{ mt: 2 }}>
              Upload
            </GradientButton>

            {successMessage && (
              <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </GlassCard>
      </Box>
    </PageContainer>
  );
};

export default withAuth(UploadVideo, ["instructor", "admin"]);
