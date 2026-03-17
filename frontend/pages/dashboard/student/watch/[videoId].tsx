import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  CardContent,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { withAuth } from "@/lib/auth";
import { apiGet, apiPost } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import VRPlayer from "@/components/player/VRPlayer";
import ChapterMarkers from "@/components/player/ChapterMarkers";
import VideoNotes from "@/components/player/VideoNotes";

interface VideoData {
  id: number;
  title: string;
  description?: string;
  video: string;
  course?: number;
  subject?: number;
}

interface UserData {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: { name: string }[];
  institution: number | null;
  programs: number[];
  courses: number[];
}

function WatchVideoPage({ user }: { user: UserData }) {
  const router = useRouter();
  const { videoId, course: courseId, subject: subjectId } = router.query;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [markedComplete, setMarkedComplete] = useState(false);
  const maxProgressRef = useRef(0);

  useEffect(() => {
    if (!videoId) return;
    const fetchVideo = async () => {
      try {
        const res = await apiGet(`/api/video/${videoId}/`);
        if (res.ok) {
          setVideo(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch video:", err);
      }
    };
    fetchVideo();
  }, [videoId]);

  const handleTimeUpdate = useCallback((seconds: number) => {
    setCurrentTime(seconds);
  }, []);

  const handleProgress = useCallback(
    (percent: number) => {
      if (percent > maxProgressRef.current) {
        maxProgressRef.current = percent;
      }

      // Auto-mark complete at 80%
      if (maxProgressRef.current >= 80 && !markedComplete && courseId) {
        setMarkedComplete(true);
        apiPost("/api/video/progress/", {
          video: Number(videoId),
          course: Number(courseId),
          progress_percent: maxProgressRef.current,
          watched: true,
        }).catch((err) => console.error("Failed to save progress:", err));
      }
    },
    [videoId, courseId, markedComplete]
  );

  const handleSeek = useCallback((seconds: number) => {
    setSeekTo(seconds);
    setTimeout(() => setSeekTo(null), 100);
  }, []);

  const handleMarkComplete = async () => {
    if (!courseId) return;
    try {
      await apiPost("/api/video/progress/", {
        video: Number(videoId),
        course: Number(courseId),
        progress_percent: Math.max(maxProgressRef.current, 100),
        watched: true,
      });
      setMarkedComplete(true);
    } catch (err) {
      console.error("Failed to mark complete:", err);
    }
  };

  if (!video) {
    return (
      <PageContainer sx={{ maxWidth: "xl" }}>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <Typography color="text.secondary">Loading video...</Typography>
        </Box>
      </PageContainer>
    );
  }

  const videoSrc = `${process.env.API_URL}/${video.video}`;

  return (
    <PageContainer sx={{ maxWidth: "xl" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "rgba(255,255,255,0.3)" }} />}
        sx={{ mb: 3 }}
      >
        <MuiLink
          underline="hover"
          sx={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
          onClick={() => router.push("/dashboard/student")}
        >
          Dashboard
        </MuiLink>
        {courseId && (
          <MuiLink
            underline="hover"
            sx={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}
            onClick={() => router.push(`/dashboard/student/course/${courseId}`)}
          >
            Course
          </MuiLink>
        )}
        <Typography sx={{ color: "#60a5fa" }}>{video.title}</Typography>
      </Breadcrumbs>

      {/* VR Player */}
      <Box sx={{ mb: 2 }}>
        <VRPlayer
          videoSrc={videoSrc}
          onTimeUpdate={handleTimeUpdate}
          onProgress={handleProgress}
          seekTo={seekTo}
        />
      </Box>

      {/* Chapter Markers */}
      <ChapterMarkers
        videoId={Number(videoId)}
        currentTime={currentTime}
        onSeek={handleSeek}
      />

      {/* Content Grid */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Video Info */}
        <Grid item xs={12} md={7}>
          <GlassCard>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#fff",
                  mb: 1,
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {video.title}
              </Typography>
              {video.description && (
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.7)", mb: 3, lineHeight: 1.7 }}
                >
                  {video.description}
                </Typography>
              )}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <GradientButton
                  onClick={handleMarkComplete}
                  disabled={markedComplete}
                  sx={
                    markedComplete
                      ? {
                          background: "rgba(34,197,94,0.2)",
                          color: "#22c55e",
                          "&:hover": { background: "rgba(34,197,94,0.25)", boxShadow: "none" },
                          "&.Mui-disabled": {
                            background: "rgba(34,197,94,0.2)",
                            color: "#22c55e",
                          },
                        }
                      : {}
                  }
                >
                  {markedComplete ? "Completed" : "Mark Complete"}
                </GradientButton>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)" }}>
                  Progress: {maxProgressRef.current}%
                </Typography>
              </Box>
            </CardContent>
          </GlassCard>
        </Grid>

        {/* Notes */}
        <Grid item xs={12} md={5}>
          <VideoNotes
            videoId={Number(videoId)}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default withAuth(WatchVideoPage, ["student"]);
