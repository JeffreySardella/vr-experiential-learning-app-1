import React, { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import AnnouncementsList from "@/components/announcements/AnnouncementsList";
import CreateAnnouncements from "@/components/announcements/CreateAnnouncements";
import EditAnnouncement from "@/components/announcements/EditAnnouncement";
import CourseContent from "@/components/course_content/CourseContent";
import QuizBuilder from "@/components/instructor/QuizBuilder";
import GradientButton from "@/components/ui/GradientButton";

interface SelectedCourseProps {
  courseId: number;
}

const SelectedCourse: React.FC<SelectedCourseProps> = ({ courseId }) => {
  const [display, setDisplay] = useState<DisplayOption>("announcements");
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<
    number | null
  >(null);

  const mainDisplayOptions: { label: string; value: string }[] = [
    { label: "Announcements", value: "announcements" },
    { label: "Course Content", value: "course content" },
    { label: "Quizzes", value: "quizzes" },
  ];

  return (
    <Box display="flex">
      <Stack direction="column" spacing={1} sx={{ minWidth: 160 }}>
        {mainDisplayOptions.map((option) => (
          <Box
            key={option.value}
            onClick={() => setDisplay(option.value)}
            sx={{
              cursor: "pointer",
              px: 2,
              py: 1.5,
              borderRadius: "8px",
              background:
                display === option.value
                  ? "rgba(59, 130, 246, 0.15)"
                  : "transparent",
              border:
                display === option.value
                  ? "1px solid rgba(59, 130, 246, 0.3)"
                  : "1px solid transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(59, 130, 246, 0.1)",
              },
            }}
          >
            <Typography
              sx={{
                color: display === option.value ? "#3b82f6" : "#94a3b8",
                fontWeight: display === option.value ? 600 : 400,
                fontSize: "0.9rem",
              }}
            >
              {option.label}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Box ml={3} flexGrow={1}>
        {display === "announcements" && (
          <AnnouncementsList
            courseId={courseId}
            setDisplay={setDisplay}
            setSelectedAnnouncementId={setSelectedAnnouncementId}
          />
        )}
        {display === "create announcement" && (
          <CreateAnnouncements courseId={courseId} setDisplay={setDisplay} />
        )}
        {display === "edit announcement" && (
          <EditAnnouncement
            courseId={courseId}
            announcementId={selectedAnnouncementId}
            setDisplay={setDisplay}
            setSelectedAnnouncementId={setSelectedAnnouncementId}
          />
        )}
        {display === "course content" && <CourseContent courseId={courseId} />}
        {display === "quizzes" && <QuizBuilder courseId={courseId} />}
      </Box>
    </Box>
  );
};

export default SelectedCourse;
