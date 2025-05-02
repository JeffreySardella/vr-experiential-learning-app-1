import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
} from "@mui/material";

const VideoContent = ({ video, courseId, subjectId, onDelete }) => {
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
        console.error("Failed to add video to subject");
      }
      onDelete();
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{video.title}</Typography>
        <Typography variant="body2">{video.description}</Typography>
      </CardContent>
      <CardMedia
        component="video"
        src={`${process.env.API_URL}/api/video/stream/?path=${video.video}`}
        controls
      />
      <CardActions>
        <Button variant="contained" color="primary" onClick={handleDelete}>
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default VideoContent;
