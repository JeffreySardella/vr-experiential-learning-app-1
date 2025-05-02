import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select a Video</DialogTitle>
      <DialogContent>
        {videos.length > 0 ? (
          <List>
            {videos.map((video) => (
              <ListItem
                button
                key={video.id}
                onClick={() => handleSelectVideo(video.id)}
              >
                <ListItemText
                  primary={video.title}
                  secondary={video.description}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No available videos to select.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VideoSelector;
