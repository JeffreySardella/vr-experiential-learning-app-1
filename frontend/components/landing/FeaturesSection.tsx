import { Box, Grid, Typography, CardContent } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import RouteIcon from "@mui/icons-material/Route";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const features = [
  { icon: <ViewInArIcon sx={{ fontSize: 40, color: "#3b82f6" }} />, title: "360° Immersive Content", description: "Experience virtual environments with full panoramic VR video playback directly in your browser." },
  { icon: <RouteIcon sx={{ fontSize: 40, color: "#06b6d4" }} />, title: "Structured Learning Paths", description: "Content organized by institution, program, course, and subject for clear academic progression." },
  { icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />, title: "Track Your Progress", description: "Monitor video completion, take timestamped notes, and test knowledge with built-in quizzes." },
  { icon: <AccountBalanceIcon sx={{ fontSize: 40, color: "#22d3ee" }} />, title: "Built for Institutions", description: "Multi-tenant platform supporting multiple universities, programs, and role-based access control." },
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: 12, px: 3 }}>
      <SectionHeader title="Why Academ-VR?" subtitle="A complete platform for immersive educational experiences" align="center" gradient />
      <Grid container spacing={3} maxWidth="lg" sx={{ mx: "auto" }}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={3} key={f.title}>
            <GlassCard glow sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary">{f.description}</Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
