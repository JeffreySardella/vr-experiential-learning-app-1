import { Box, Typography, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface AnnouncementsListProps {
  courseId: number;
  setDisplay: (display: DisplayOption) => void;
  setSelectedAnnouncementId: (announcementId: number | null) => void;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  courseId,
  setDisplay,
  setSelectedAnnouncementId,
}) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/institutions/course/${courseId}/announcements`
        );
        const data = await response.json();
        // Sort: pinned announcements first, then by date descending
        const sorted = [...data].sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (
            new Date(b.datetime_created).getTime() -
            new Date(a.datetime_created).getTime()
          );
        });
        setAnnouncements(sorted);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [courseId]);

  const handleEdit = (announcementId: number) => {
    setSelectedAnnouncementId(announcementId);
    setDisplay("edit announcement");
  };

  const navigateToCreate = () => {
    setDisplay("create announcement");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#f1f5f9",
            fontWeight: 700,
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Announcements
        </Typography>
        <GradientButton onClick={() => navigateToCreate()}>
          Create Announcement
        </GradientButton>
      </Box>

      {announcements.map((announcement) => (
        <GlassCard key={announcement.id} sx={{ mb: 2, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#f1f5f9", fontWeight: 600 }}
                >
                  {announcement.title}
                </Typography>
                {announcement.pinned && (
                  <Chip
                    label="Pinned"
                    size="small"
                    sx={{
                      background: "rgba(139, 92, 246, 0.15)",
                      color: "#a78bfa",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 1 }}>
                {new Date(announcement.datetime_created).toLocaleDateString()}
              </Typography>
              <Typography sx={{ color: "#cbd5e1" }}>
                {announcement.body}
              </Typography>
            </Box>
            <GradientButton
              size="small"
              onClick={() => handleEdit(announcement.id)}
              sx={{ ml: 2, flexShrink: 0, px: 2, py: 0.5 }}
            >
              Edit
            </GradientButton>
          </Box>
        </GlassCard>
      ))}

      {announcements.length === 0 && (
        <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
          No announcements yet. Create one to get started.
        </Typography>
      )}
    </Box>
  );
};

export default AnnouncementsList;
