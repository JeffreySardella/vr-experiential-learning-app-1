import React, { useEffect, useState } from "react";
import SubjectContent from "./SubjectContent";
import VideoContent from "./VideoContent";
import VideoSelector from "./VideoSelector";
import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GradientButton from "@/components/ui/GradientButton";

const accordionSx = {
  mb: 2,
  background: "rgba(21, 27, 46, 0.6)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(59, 130, 246, 0.1)",
  borderRadius: "8px !important",
  "&:before": { display: "none" },
  "& .MuiAccordionSummary-root": {
    borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
  },
};

const CourseContent = ({ courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [isVideoSelectorOpen, setIsVideoSelectorOpen] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const updateContent = async () => {
    setReloadTrigger((prev) => prev + 1);
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
    return (
      <Typography sx={{ color: "#94a3b8" }}>Loading...</Typography>
    );
  }

  return (
    <Box p={2}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#f1f5f9",
          fontWeight: 700,
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
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
        <Accordion sx={accordionSx}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8" }} />}
          >
            <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
              Other Content
            </Typography>
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
                <Typography sx={{ color: "#94a3b8" }}>
                  No content available.
                </Typography>
              )}
              <GradientButton
                onClick={() => setIsVideoSelectorOpen(true)}
                sx={{ alignSelf: "flex-start" }}
              >
                Add Video
              </GradientButton>
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
