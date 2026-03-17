import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { apiGet, apiPost } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import QuestionEditor from "./QuestionEditor";

interface Quiz {
  id: number;
  title: string;
  questions_count?: number;
  questions?: any[];
}

interface QuizBuilderProps {
  courseId: number;
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

const darkSelectSx = {
  color: "#f1f5f9",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3b82f6",
  },
  "& .MuiSvgIcon-root": { color: "#94a3b8" },
};

export default function QuizBuilder({ courseId }: QuizBuilderProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuizzes = async () => {
    try {
      const res = await apiGet(`/api/quizzes/?course_id=${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await apiPost("/api/quizzes/", {
        title: title.trim(),
        course: courseId,
      });
      if (res.ok) {
        setTitle("");
        fetchQuizzes();
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
    setLoading(false);
  };

  const toggleQuiz = (quizId: number) => {
    setExpandedQuizId(expandedQuizId === quizId ? null : quizId);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          color: "#f1f5f9",
          fontWeight: 700,
          mb: 3,
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Quiz Builder
      </Typography>

      {/* Create Quiz Form */}
      <GlassCard sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
        >
          Create New Quiz
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Quiz Title"
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ ...darkTextFieldSx, flexGrow: 1 }}
          />
          <GradientButton onClick={handleCreate} disabled={loading}>
            Create Quiz
          </GradientButton>
        </Stack>
      </GlassCard>

      {/* Quiz List */}
      {quizzes.length > 0 ? (
        <Stack spacing={2}>
          {quizzes.map((quiz) => (
            <GlassCard key={quiz.id}>
              <ListItemButton
                onClick={() => toggleQuiz(quiz.id)}
                sx={{
                  px: 3,
                  py: 2,
                  "&:hover": { background: "rgba(59, 130, 246, 0.05)" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                      {quiz.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                      {quiz.questions_count ?? quiz.questions?.length ?? 0} questions
                    </Typography>
                  }
                />
                {expandedQuizId === quiz.id ? (
                  <ExpandLessIcon sx={{ color: "#94a3b8" }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: "#94a3b8" }} />
                )}
              </ListItemButton>
              <Collapse in={expandedQuizId === quiz.id}>
                <Box sx={{ px: 3, pb: 3 }}>
                  <QuestionEditor quizId={quiz.id} />
                </Box>
              </Collapse>
            </GlassCard>
          ))}
        </Stack>
      ) : (
        <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
          No quizzes yet. Create one above to get started.
        </Typography>
      )}
    </Box>
  );
}
