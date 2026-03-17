import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

const darkPaperProps = {
  sx: {
    background: "rgba(21, 27, 46, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(59, 130, 246, 0.1)",
    borderRadius: "12px",
    minWidth: 400,
  },
};

const VideoSelector = ({ open, onClose, onSelect, courseId, subjectId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchVideos = async () => {
        setLoading(true);
        try {
          let url = `${process.env.API_URL}/api/video`;
          if (courseId) {
            url += `?exclude_course_id=${courseId}`;
          } else if (subjectId) {
            url += `?exclude_subject_id=${subjectId}`;
          }
          const response = await fetch(url);
          const data = await response.json();
          setVideos(data);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
        setLoading(false);
      };

      fetchVideos();
    }
  }, [open, courseId, subjectId]);

  const handleSelectVideo = (videoId) => {
    onSelect(videoId);
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={darkPaperProps}>
      <DialogTitle
        sx={{
          color: "#f1f5f9",
          fontWeight: 600,
          borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
        }}
      >
        Select a Video
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress sx={{ color: "#3b82f6" }} />
          </Box>
        ) : videos.length > 0 ? (
          <List>
            {videos.map((video) => (
              <ListItem key={video.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSelectVideo(video.id)}
                  sx={{
                    "&:hover": {
                      background: "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  <ListItemText
                    primary={video.title}
                    secondary={video.description}
                    sx={{
                      "& .MuiListItemText-primary": { color: "#f1f5f9" },
                      "& .MuiListItemText-secondary": { color: "#94a3b8" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ color: "#94a3b8", p: 3 }}>
            No available videos to select.
          </Typography>
        )}
      </DialogContent>
      <DialogActions
        sx={{ borderTop: "1px solid rgba(59, 130, 246, 0.1)", p: 2 }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            "&:hover": { color: "#f1f5f9", background: "rgba(59, 130, 246, 0.1)" },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoSelector;
