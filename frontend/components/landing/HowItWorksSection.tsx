import { Box, Grid, Typography } from "@mui/material";
import SectionHeader from "@/components/ui/SectionHeader";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const steps = [
  { icon: <SchoolIcon sx={{ fontSize: 48, color: "#3b82f6" }} />, number: "01", title: "Enroll in a Course", description: "Sign up, choose your institution and program, then join courses with a simple access code." },
  { icon: <PlayCircleIcon sx={{ fontSize: 48, color: "#06b6d4" }} />, number: "02", title: "Watch VR Content", description: "Dive into 360° immersive videos. Take notes, explore chapter markers, and learn at your pace." },
  { icon: <EmojiEventsIcon sx={{ fontSize: 48, color: "#8b5cf6" }} />, number: "03", title: "Track Your Progress", description: "Complete quizzes, monitor your progress across courses, and achieve your learning goals." },
];

export default function HowItWorksSection() {
  return (
    <Box sx={{ py: 12, px: 3, background: "rgba(15, 23, 42, 0.5)" }}>
      <SectionHeader title="How It Works" subtitle="Three simple steps to start your immersive learning journey" align="center" gradient />
      <Grid container spacing={4} maxWidth="md" sx={{ mx: "auto" }}>
        {steps.map((step) => (
          <Grid item xs={12} md={4} key={step.number}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
                {step.icon}
              </Box>
              <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 700, letterSpacing: 2 }}>STEP {step.number}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 1 }}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">{step.description}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
