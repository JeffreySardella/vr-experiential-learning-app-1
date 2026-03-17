import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface ChapterMarker {
  id: number;
  timestamp_seconds: number;
  label: string;
}

interface ChapterMarkerEditorProps {
  videoId: number;
}

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    "& fieldset": { borderColor: "rgba(59, 130, 246, 0.2)" },
    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChapterMarkerEditor({ videoId }: ChapterMarkerEditorProps) {
  const [markers, setMarkers] = useState<ChapterMarker[]>([]);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMarkers = async () => {
    try {
      const res = await apiGet(`/api/video/${videoId}/chapters/`);
      if (res.ok) {
        const data = await res.json();
        setMarkers(data);
      }
    } catch (error) {
      console.error("Error fetching chapter markers:", error);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, [videoId]);

  const handleAdd = async () => {
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const timestamp_seconds = mins * 60 + secs;

    if (!label.trim()) return;

    setLoading(true);
    try {
      const res = await apiPost(`/api/video/${videoId}/chapters/`, {
        timestamp_seconds,
        label: label.trim(),
      });
      if (res.ok) {
        setMinutes("");
        setSeconds("");
        setLabel("");
        fetchMarkers();
      }
    } catch (error) {
      console.error("Error adding chapter marker:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (markerId: number) => {
    try {
      await apiDelete(`/api/video/${videoId}/chapters/${markerId}/`);
      fetchMarkers();
    } catch (error) {
      console.error("Error deleting chapter marker:", error);
    }
  };

  return (
    <GlassCard sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}>
        Chapter Markers
      </Typography>

      {markers.length > 0 ? (
        <List dense sx={{ mb: 2 }}>
          {markers
            .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds)
            .map((marker) => (
              <ListItem
                key={marker.id}
                sx={{
                  background: "rgba(59, 130, 246, 0.05)",
                  borderRadius: "6px",
                  mb: 0.5,
                  border: "1px solid rgba(59, 130, 246, 0.08)",
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(marker.id)}
                    sx={{ color: "#ef4444" }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#06b6d4",
                          fontFamily: "monospace",
                          fontWeight: 600,
                          minWidth: 50,
                        }}
                      >
                        {formatTimestamp(marker.timestamp_seconds)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#f1f5f9" }}>
                        {marker.label}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
          No chapter markers yet.
        </Typography>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Min"
          size="small"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          sx={{ ...darkTextFieldSx, width: 70 }}
          type="number"
          inputProps={{ min: 0 }}
        />
        <Typography sx={{ color: "#94a3b8" }}>:</Typography>
        <TextField
          label="Sec"
          size="small"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          sx={{ ...darkTextFieldSx, width: 70 }}
          type="number"
          inputProps={{ min: 0, max: 59 }}
        />
        <TextField
          label="Label"
          size="small"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ ...darkTextFieldSx, flexGrow: 1 }}
        />
        <GradientButton
          size="small"
          onClick={handleAdd}
          disabled={loading}
          sx={{ py: 1 }}
        >
          Add
        </GradientButton>
      </Stack>
    </GlassCard>
  );
}
