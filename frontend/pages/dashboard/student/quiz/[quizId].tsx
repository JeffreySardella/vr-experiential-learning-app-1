import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  CardContent,
  LinearProgress,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { withAuth } from "@/lib/auth";
import { apiGet, apiPost } from "@/lib/api";
import PageContainer from "@/components/ui/PageContainer";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

interface Choice {
  id: number;
  text: string;
  is_correct?: boolean;
}

interface Question {
  id: number;
  text: string;
  order: number;
  choices: Choice[];
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface AnswerResult {
  question_id: number;
  selected_choice: number;
  correct_choice: number;
  is_correct: boolean;
}

interface AttemptResult {
  id: number;
  score: number;
  answers: AnswerResult[];
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

function QuizPage({ user }: { user: UserData }) {
  const router = useRouter();
  const { quizId } = router.query;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const res = await apiGet(`/api/quizzes/${quizId}/`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleChoiceSelect = (questionId: number, choiceId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);

    const payload = {
      answers: quiz.questions.map((q) => ({
        question_id: q.id,
        choice_id: answers[q.id],
      })),
    };

    try {
      const res = await apiPost(`/api/quizzes/${quizId}/attempt/`, payload);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <PageContainer>
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <Typography color="text.secondary">Loading quiz...</Typography>
        </Box>
      </PageContainer>
    );
  }

  const questions = quiz.questions;
  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  // Results view
  if (submitted && result) {
    const scoreColor = result.score >= 70 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444";

    return (
      <PageContainer>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ color: "#3b82f6" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quiz Results
          </Typography>
        </Box>

        {/* Score card */}
        <GlassCard sx={{ mb: 4, textAlign: "center", py: 4 }}>
          <CardContent>
            <Typography variant="h2" sx={{ fontWeight: 800, color: scoreColor, mb: 1 }}>
              {Math.round(result.score)}%
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {result.answers.filter((a) => a.is_correct).length} of {totalQuestions} correct
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mt: 1 }}>
              {quiz.title}
            </Typography>
          </CardContent>
        </GlassCard>

        {/* Question review */}
        <Stack spacing={2}>
          {questions.map((q, idx) => {
            const answerResult = result.answers.find((a) => a.question_id === q.id);
            const isCorrect = answerResult?.is_correct;

            return (
              <GlassCard key={q.id}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                    {isCorrect ? (
                      <CheckCircleIcon sx={{ color: "#22c55e", mt: 0.3 }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444", mt: 0.3 }} />
                    )}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#fff" }}>
                      {idx + 1}. {q.text}
                    </Typography>
                  </Box>
                  <Stack spacing={1} sx={{ ml: 4.5 }}>
                    {q.choices.map((choice) => {
                      const isSelected = answerResult?.selected_choice === choice.id;
                      const isCorrectChoice = answerResult?.correct_choice === choice.id;

                      let borderColor = "rgba(59, 130, 246, 0.1)";
                      let bgColor = "transparent";
                      if (isCorrectChoice) {
                        borderColor = "#22c55e";
                        bgColor = "rgba(34, 197, 94, 0.08)";
                      } else if (isSelected && !isCorrect) {
                        borderColor = "#ef4444";
                        bgColor = "rgba(239, 68, 68, 0.08)";
                      }

                      return (
                        <Box
                          key={choice.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            border: `1px solid ${borderColor}`,
                            bgcolor: bgColor,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: isCorrectChoice
                                ? "#22c55e"
                                : isSelected && !isCorrect
                                  ? "#ef4444"
                                  : "rgba(255,255,255,0.6)",
                              fontWeight: isSelected || isCorrectChoice ? 600 : 400,
                            }}
                          >
                            {choice.text}
                            {isCorrectChoice && " (correct)"}
                            {isSelected && !isCorrect && !isCorrectChoice && " (your answer)"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </CardContent>
              </GlassCard>
            );
          })}
        </Stack>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <GradientButton onClick={() => router.back()}>Back to Course</GradientButton>
        </Box>
      </PageContainer>
    );
  }

  // Quiz taking view
  return (
    <PageContainer>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ color: "#3b82f6" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {quiz.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
        </Box>
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={((currentQuestion + 1) / totalQuestions) * 100}
        sx={{
          mb: 4,
          height: 6,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.08)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 3,
            background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
          },
        }}
      />

      {/* Question */}
      <GlassCard sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff", mb: 3 }}>
            {currentQ.text}
          </Typography>

          <RadioGroup
            value={answers[currentQ.id] ?? ""}
            onChange={(e) => handleChoiceSelect(currentQ.id, Number(e.target.value))}
          >
            <Stack spacing={1.5}>
              {currentQ.choices.map((choice) => {
                const isSelected = answers[currentQ.id] === choice.id;
                return (
                  <GlassCard
                    key={choice.id}
                    sx={{
                      cursor: "pointer",
                      border: isSelected
                        ? "1px solid rgba(59, 130, 246, 0.5)"
                        : "1px solid rgba(59, 130, 246, 0.1)",
                      bgcolor: isSelected ? "rgba(59, 130, 246, 0.08)" : "transparent",
                      "&:hover": {
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                        bgcolor: "rgba(59, 130, 246, 0.04)",
                      },
                    }}
                    onClick={() => handleChoiceSelect(currentQ.id, choice.id)}
                  >
                    <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                      <FormControlLabel
                        value={choice.id}
                        control={
                          <Radio
                            sx={{
                              color: "rgba(255,255,255,0.3)",
                              "&.Mui-checked": { color: "#3b82f6" },
                            }}
                          />
                        }
                        label={
                          <Typography variant="body1" sx={{ color: "#fff" }}>
                            {choice.text}
                          </Typography>
                        }
                        sx={{ m: 0, width: "100%" }}
                      />
                    </CardContent>
                  </GlassCard>
                );
              })}
            </Stack>
          </RadioGroup>
        </CardContent>
      </GlassCard>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <GradientButton
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
          sx={{
            opacity: currentQuestion === 0 ? 0.4 : 1,
          }}
        >
          Previous
        </GradientButton>

        {/* Question dots */}
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {questions.map((q, idx) => (
            <Box
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                cursor: "pointer",
                bgcolor:
                  idx === currentQuestion
                    ? "#3b82f6"
                    : answers[q.id] !== undefined
                      ? "#06b6d4"
                      : "rgba(255,255,255,0.2)",
                transition: "all 0.2s ease",
              }}
            />
          ))}
        </Box>

        {currentQuestion < totalQuestions - 1 ? (
          <GradientButton onClick={() => setCurrentQuestion((prev) => prev + 1)}>
            Next
          </GradientButton>
        ) : (
          <GradientButton onClick={handleSubmit} disabled={!allAnswered || submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </GradientButton>
        )}
      </Box>
    </PageContainer>
  );
}

export default withAuth(QuizPage, ["student"]);
