import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VideoContent from "./VideoContent";
import VideoSelector from "./VideoSelector";
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
    <Accordion sx={accordionSx}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8" }} />}
      >
        <Typography variant="h5" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
          {subject.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" paragraph sx={{ color: "#94a3b8" }}>
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
          <Typography sx={{ color: "#94a3b8" }}>
            No content available.
          </Typography>
        )}
        <GradientButton
          onClick={handleOpenVideoSelector}
          sx={{ mt: 2 }}
        >
          Add Video
        </GradientButton>
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
