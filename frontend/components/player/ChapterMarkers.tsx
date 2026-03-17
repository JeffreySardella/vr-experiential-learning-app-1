import { useEffect, useState } from "react";
import { Stack, Chip, Box } from "@mui/material";
import { apiGet } from "@/lib/api";

interface Chapter {
  id: number;
  title: string;
  timestamp_seconds: number;
}

interface ChapterMarkersProps {
  videoId: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function ChapterMarkers({ videoId, currentTime, onSeek }: ChapterMarkersProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!videoId) return;
    const fetchChapters = async () => {
      try {
        const res = await apiGet(`/api/video/${videoId}/chapters/`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data);
        }
      } catch (err) {
        console.error("Failed to fetch chapters:", err);
      }
    };
    fetchChapters();
  }, [videoId]);

  if (chapters.length === 0) return null;

  // Find active chapter: last marker where timestamp <= currentTime
  const sortedChapters = [...chapters].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);
  let activeIndex = -1;
  for (let i = sortedChapters.length - 1; i >= 0; i--) {
    if (sortedChapters[i].timestamp_seconds <= currentTime) {
      activeIndex = i;
      break;
    }
  }

  return (
    <Box
      sx={{
        mt: 2,
        px: 1,
        py: 1,
        overflowX: "auto",
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(59,130,246,0.3)", borderRadius: 2 },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ minWidth: "max-content" }}>
        {sortedChapters.map((chapter, idx) => {
          const isActive = idx === activeIndex;
          return (
            <Chip
              key={chapter.id}
              label={`${formatTime(chapter.timestamp_seconds)} - ${chapter.title}`}
              onClick={() => onSeek(chapter.timestamp_seconds)}
              sx={{
                bgcolor: isActive ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.06)",
                color: isActive ? "#60a5fa" : "rgba(255,255,255,0.6)",
                border: isActive ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "rgba(59,130,246,0.15)",
                  color: "#60a5fa",
                },
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
