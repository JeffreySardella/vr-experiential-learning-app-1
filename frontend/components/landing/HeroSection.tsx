import { Box, Typography, Stack } from "@mui/material";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "./AuroraBackground";
import Link from "next/link";
import { register, login } from "@/links/links";

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <AuroraBackground />
      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700, mb: 2,
            fontSize: { xs: "2rem", md: "3.5rem" },
            background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Experience Learning in a New Dimension
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 600, mx: "auto", fontWeight: 400 }}>
          Immersive 360° VR content for universities. Explore, learn, and track your progress — all from your browser.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Link href={register} style={{ textDecoration: "none" }}>
            <GradientButton size="large">Get Started</GradientButton>
          </Link>
          <Link href={login} style={{ textDecoration: "none" }}>
            <GradientButton
              size="large"
              sx={{
                background: "transparent",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                "&:hover": { background: "rgba(59, 130, 246, 0.1)", boxShadow: "none" },
              }}
            >
              Log In
            </GradientButton>
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
