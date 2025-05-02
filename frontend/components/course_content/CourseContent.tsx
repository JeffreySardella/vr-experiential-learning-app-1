import React, { useEffect, useState } from "react";
import SubjectContent from "./SubjectContent";
import VideoContent from "./VideoContent";
import VideoSelector from "./VideoSelector";
import {
  Box,
  Button,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CourseContent = ({ courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [isVideoSelectorOpen, setIsVideoSelectorOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const updateContent = async () => {
    setReloadTrigger((prev) => prev + 1);
    console.log(reloadTrigger);
  };

  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/courses/${courseId}`
      );
      const data = await response.json();
      setCourseData(data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId, reloadTrigger]);

  const handleAddVideoToCourse = async (videoId) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/courses/${courseId}/videos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ video_id: videoId }),
        }
      );
      if (!response.ok) {
        console.error("Failed to add video to subject");
      }
      setIsVideoSelectorOpen(false);
      updateContent();
    } catch (error) {
      console.error("Error adding video to subject:", error);
    }
  };

  if (!courseData) {
    return <p>Loading...</p>;
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        {courseData.name}
      </Typography>
      <Stack spacing={2}>
        {courseData.subjects.map((subject) => (
          <SubjectContent
            key={subject.id}
            subject={subject}
            updateContent={updateContent}
          />
        ))}
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Other Content</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              {courseData.videos.length > 0 ? (
                courseData.videos.map((video) => (
                  <VideoContent
                    key={video.id}
                    video={video}
                    courseId={courseId}
                    onDelete={updateContent}
                  />
                ))
              ) : (
                <Typography variant="body1">No content available.</Typography>
              )}
              <Button
                variant="contained"
                onClick={() => setIsVideoSelectorOpen(true)}
              >
                Add Video
              </Button>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
      <VideoSelector
        open={isVideoSelectorOpen}
        onClose={() => setIsVideoSelectorOpen(false)}
        onSelect={(videoId) => {
          handleAddVideoToCourse(videoId);
        }}
        courseId={courseId}
      />
    </Box>
  );
};

export default CourseContent;
