import React, { useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";

const VideoContent = ({ video, courseId, subjectId, onDelete }) => {
  const [showChapters, setShowChapters] = useState(false);

  const handleDelete = async () => {
    try {
      let url;
      if (subjectId) {
        url = `${process.env.API_URL}/api/subjects/${subjectId}/videos/${video.id}`;
      } else {
        url = `${process.env.API_URL}/api/courses/${courseId}/videos/${video.id}`;
      }

      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete video");
      }
      onDelete();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <GlassCard sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
          {video.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8" }}>
          {video.description}
        </Typography>
      </CardContent>
      <CardMedia
        component="video"
        src={`${process.env.API_URL}/api/video/stream/?path=${video.video}`}
        controls
        sx={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)" }}
      />
      <CardActions sx={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)", px: 2, py: 1.5 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setShowChapters(!showChapters)}
          sx={{
            color: "#06b6d4",
            borderColor: "rgba(6, 182, 212, 0.3)",
            "&:hover": {
              borderColor: "#06b6d4",
              background: "rgba(6, 182, 212, 0.1)",
            },
          }}
        >
          {showChapters ? "Hide Chapters" : "Chapters"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleDelete}
          sx={{
            color: "#ef4444",
            borderColor: "rgba(239, 68, 68, 0.3)",
            "&:hover": {
              borderColor: "#ef4444",
              background: "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          Remove
        </Button>
      </CardActions>
      {showChapters && (
        <Box sx={{ px: 2, pb: 2 }}>
          <ChapterMarkerEditorLazy videoId={video.id} />
        </Box>
      )}
    </GlassCard>
  );
};

// Lazy import to avoid circular deps - we'll integrate properly after creating the component
const ChapterMarkerEditorLazy = ({ videoId }: { videoId: number }) => {
  const [ChapterMarkerEditor, setComp] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    import("@/components/instructor/ChapterMarkerEditor").then((mod) => {
      setComp(() => mod.default);
    });
  }, []);

  if (!ChapterMarkerEditor) return <Typography sx={{ color: "#94a3b8" }}>Loading chapters...</Typography>;
  return <ChapterMarkerEditor videoId={videoId} />;
};

export default VideoContent;
