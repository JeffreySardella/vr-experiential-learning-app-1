import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  text: string;
  choices: Choice[];
}

interface QuestionEditorProps {
  quizId: number;
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

export default function QuestionEditor({ quizId }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    try {
      const res = await apiGet(`/api/quizzes/${quizId}/questions/`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const handleAddQuestion = async () => {
    if (!questionText.trim()) return;
    const nonEmptyChoices = choices.filter((c) => c.trim());
    if (nonEmptyChoices.length < 2) return;

    setLoading(true);
    try {
      const choicesPayload = choices
        .filter((c) => c.trim())
        .map((text, index) => ({
          text: text.trim(),
          is_correct: index === correctIndex,
        }));

      const res = await apiPost(`/api/quizzes/${quizId}/questions/`, {
        text: questionText.trim(),
        choices: choicesPayload,
      });
      if (res.ok) {
        setQuestionText("");
        setChoices(["", "", "", ""]);
        setCorrectIndex(0);
        fetchQuestions();
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
    setLoading(false);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await apiDelete(`/api/quizzes/${quizId}/questions/${questionId}/`);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleChoiceChange = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  return (
    <Box>
      {/* Existing Questions */}
      {questions.length > 0 && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {questions.map((question, qIdx) => (
            <Box
              key={question.id}
              sx={{
                p: 2,
                background: "rgba(59, 130, 246, 0.05)",
                borderRadius: "8px",
                border: "1px solid rgba(59, 130, 246, 0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1 }}>
                  Q{qIdx + 1}: {question.text}
                </Typography>
                <IconButton
                  onClick={() => handleDeleteQuestion(question.id)}
                  sx={{ color: "#ef4444" }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              <Stack spacing={0.5} sx={{ pl: 2 }}>
                {question.choices.map((choice) => (
                  <Typography
                    key={choice.id}
                    variant="body2"
                    sx={{
                      color: choice.is_correct ? "#22c55e" : "#94a3b8",
                      fontWeight: choice.is_correct ? 600 : 400,
                    }}
                  >
                    {choice.is_correct ? "* " : "  "}
                    {choice.text}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Add Question Form */}
      <Divider sx={{ borderColor: "rgba(59, 130, 246, 0.1)", mb: 2 }} />
      <Typography
        variant="subtitle2"
        sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
      >
        Add Question
      </Typography>

      <TextField
        label="Question Text"
        size="small"
        fullWidth
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        sx={{ ...darkTextFieldSx, mb: 2 }}
      />

      <RadioGroup
        value={correctIndex.toString()}
        onChange={(e) => setCorrectIndex(parseInt(e.target.value))}
      >
        <Stack spacing={1}>
          {choices.map((choice, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControlLabel
                value={idx.toString()}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "#94a3b8",
                      "&.Mui-checked": { color: "#22c55e" },
                    }}
                  />
                }
                label=""
                sx={{ mr: 0, ml: 0 }}
              />
              <TextField
                label={`Choice ${idx + 1}`}
                size="small"
                fullWidth
                value={choice}
                onChange={(e) => handleChoiceChange(idx, e.target.value)}
                sx={darkTextFieldSx}
              />
            </Box>
          ))}
        </Stack>
      </RadioGroup>

      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 1, mb: 2 }}>
        Select the radio button next to the correct answer.
      </Typography>

      <GradientButton onClick={handleAddQuestion} disabled={loading} size="small">
        Add Question
      </GradientButton>
    </Box>
  );
}
