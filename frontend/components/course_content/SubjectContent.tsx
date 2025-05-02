import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VideoContent from "./VideoContent";
import VideoSelector from "./VideoSelector";

const SubjectContent = ({ subject, updateContent }) => {
  const hasContent = subject.videos.length > 0 || subject.subjects.length > 0;
  const [isVideoSelectorOpen, setIsVideoSelectorOpen] = useState(false);

  const handleOpenVideoSelector = () => {
    setIsVideoSelectorOpen(true);
  };

  const handleCloseVideoSelector = () => {
    setIsVideoSelectorOpen(false);
  };

  const handleAddVideoToSubject = async (videoId) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/subjects/${subject.id}/videos`,
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

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5">{subject.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph>
          {subject.description}
        </Typography>
        {hasContent ? (
          <Stack spacing={2}>
            {subject.videos.map((video) => (
              <VideoContent
                key={video.id}
                video={video}
                courseId={subject.courseId}
                subjectId={subject.id}
                onDelete={updateContent}
              />
            ))}
            {subject.subjects.map((subSubject) => (
              <SubjectContent
                key={subSubject.id}
                subject={subSubject}
                updateContent={updateContent}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="body1">No content available.</Typography>
        )}
        <Button variant="contained" onClick={handleOpenVideoSelector}>
          Add Video
        </Button>
        <VideoSelector
          open={isVideoSelectorOpen}
          onClose={handleCloseVideoSelector}
          onSelect={handleAddVideoToSubject}
          subjectId={subject.id}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default SubjectContent;
