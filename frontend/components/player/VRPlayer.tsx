import { useEffect, useRef, useState, useCallback } from "react";
import { Box, IconButton, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

interface VRPlayerProps {
  videoSrc: string;
  onTimeUpdate?: (seconds: number) => void;
  onProgress?: (percent: number) => void;
  seekTo?: number | null;
}

export default function VRPlayer({ videoSrc, onTimeUpdate, onProgress, seekTo }: VRPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<Element | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [aframeLoaded, setAframeLoaded] = useState(false);

  // Load A-Frame script client-side
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = document.querySelector('script[src*="aframe"]');
    if (existing) {
      setAframeLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://aframe.io/releases/1.5.0/aframe.min.js";
    script.async = true;
    script.onload = () => setAframeLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Build A-Frame scene using safe DOM APIs
  useEffect(() => {
    if (!aframeLoaded || !containerRef.current || !videoRef.current) return;

    // Clean up any previous scene
    if (sceneRef.current && containerRef.current.contains(sceneRef.current)) {
      containerRef.current.removeChild(sceneRef.current);
    }

    const scene = document.createElement("a-scene");
    scene.setAttribute("embedded", "");
    scene.setAttribute("vr-mode-ui", "enabled: false");
    scene.setAttribute("style", "height: 500px; width: 100%;");

    const videosphere = document.createElement("a-videosphere");
    videosphere.setAttribute("src", "#vr-video-src");
    videosphere.setAttribute("rotation", "0 -90 0");

    const camera = document.createElement("a-camera");
    camera.setAttribute("wasd-controls-enabled", "false");

    scene.appendChild(videosphere);
    scene.appendChild(camera);
    containerRef.current.appendChild(scene);
    sceneRef.current = scene;

    return () => {
      if (sceneRef.current && containerRef.current && containerRef.current.contains(sceneRef.current)) {
        containerRef.current.removeChild(sceneRef.current);
        sceneRef.current = null;
      }
    };
  }, [aframeLoaded, videoSrc]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      if (video.duration > 0) {
        const pct = Math.round((time / video.duration) * 100);
        onProgress?.(pct);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setPlaying(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate, onProgress]);

  // seekTo effect
  useEffect(() => {
    if (seekTo != null && videoRef.current) {
      videoRef.current.currentTime = seekTo;
    }
  }, [seekTo]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const newTime = value as number;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (s: number): string => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box>
      {/* Hidden video element for A-Frame source */}
      <video
        ref={videoRef}
        id="vr-video-src"
        src={videoSrc}
        crossOrigin="anonymous"
        playsInline
        style={{ display: "none" }}
      />

      {/* A-Frame scene container */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid rgba(59,130,246,0.15)",
          "& a-scene": { borderRadius: "12px" },
        }}
      />

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 1,
          px: 2,
          py: 1,
          bgcolor: "rgba(21,27,46,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "8px",
          border: "1px solid rgba(59,130,246,0.1)",
        }}
      >
        <IconButton onClick={togglePlay} sx={{ color: "#3b82f6" }}>
          {playing ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", minWidth: 45 }}>
          {formatTime(currentTime)}
        </Box>
        <Slider
          value={currentTime}
          max={duration || 100}
          onChange={handleSliderChange}
          sx={{
            flex: 1,
            color: "#3b82f6",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
              bgcolor: "#3b82f6",
              "&:hover": { boxShadow: "0 0 8px rgba(59,130,246,0.4)" },
            },
            "& .MuiSlider-track": {
              background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
              border: "none",
            },
            "& .MuiSlider-rail": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        />
        <Box sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", minWidth: 45 }}>
          {formatTime(duration)}
        </Box>
      </Box>
    </Box>
  );
}
