import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import AnnouncementsList from "@/components/announcements/AnnouncementsList";
import CreateAnnouncements from "@/components/announcements/CreateAnnouncements";
import EditAnnouncement from "@/components/announcements/EditAnnouncement";
import CourseContent from "@/components/course_content/CourseContent";

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
  ];

  return (
    <Box display="flex">
      <Stack direction="column" spacing={1}>
        {mainDisplayOptions.map((option) => (
          <Button key={option.value} onClick={() => setDisplay(option.value)}>
            {option.label}
          </Button>
        ))}
      </Stack>
      <Box ml={2} flexGrow={1}>
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
      </Box>
    </Box>
  );
};

export default SelectedCourse;
