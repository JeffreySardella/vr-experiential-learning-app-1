import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";

interface Note {
  id: number;
  timestamp_seconds: number;
  text: string;
}

interface VideoNotesProps {
  videoId: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoNotes({ videoId, currentTime, onSeek }: VideoNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    if (!videoId) return;
    try {
      const res = await apiGet(`/api/video/${videoId}/notes/`);
      if (res.ok) {
        setNotes(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [videoId]);

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    setSaving(true);
    try {
      const res = await apiPost(`/api/video/${videoId}/notes/`, {
        timestamp_seconds: Math.floor(currentTime),
        text: newNoteText.trim(),
      });
      if (res.ok) {
        setNewNoteText("");
        await fetchNotes();
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      const res = await apiDelete(`/api/video/${videoId}/notes/${noteId}/`);
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const sortedNotes = [...notes].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds);

  return (
    <GlassCard>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 2 }}>
          My Notes
        </Typography>

        {/* Scrollable notes list */}
        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            mb: 2,
            pr: 0.5,
            "&::-webkit-scrollbar": { width: 4 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(59,130,246,0.3)", borderRadius: 2 },
          }}
        >
          {sortedNotes.length > 0 ? (
            <Stack spacing={1.5}>
              {sortedNotes.map((note) => (
                <Box
                  key={note.id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    p: 1.5,
                    borderRadius: "8px",
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Button
                    size="small"
                    onClick={() => onSeek(note.timestamp_seconds)}
                    sx={{
                      minWidth: "auto",
                      px: 1,
                      py: 0.25,
                      color: "#60a5fa",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      bgcolor: "rgba(59,130,246,0.1)",
                      borderRadius: "4px",
                      "&:hover": { bgcolor: "rgba(59,130,246,0.2)" },
                      flexShrink: 0,
                    }}
                  >
                    {formatTime(note.timestamp_seconds)}
                  </Button>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.8)", flex: 1, wordBreak: "break-word" }}
                  >
                    {note.text}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteNote(note.id)}
                    sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#f87171" }, flexShrink: 0 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.4)", textAlign: "center", py: 3 }}
            >
              No notes yet. Add your first note below.
            </Typography>
          )}
        </Box>

        {/* Add note form */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder={`Note at ${formatTime(currentTime)}...`}
            fullWidth
            size="small"
            multiline
            maxRows={3}
            disabled={saving}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                fontSize: "0.875rem",
                "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                "&:hover fieldset": { borderColor: "rgba(59,130,246,0.4)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
            }}
          />
          <Button
            onClick={handleAddNote}
            disabled={saving || !newNoteText.trim()}
            sx={{
              minWidth: "auto",
              px: 2,
              py: 1,
              color: "#fff",
              bgcolor: "rgba(59,130,246,0.2)",
              "&:hover": { bgcolor: "rgba(59,130,246,0.3)" },
              "&:disabled": { color: "rgba(255,255,255,0.2)" },
              flexShrink: 0,
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </GlassCard>
  );
}
