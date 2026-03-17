import { Box, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import { login, register } from "@/links/links";

const techStack = ["Next.js", "Django", "A-Frame", "React", "MUI", "DRF"];

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 6, px: 3, textAlign: "center", borderTop: "1px solid rgba(59, 130, 246, 0.1)", background: "rgba(10, 15, 30, 0.9)" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "inline-block" }}>
        Academ-VR
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 3 }}>
        <Link href={login} style={{ textDecoration: "none", color: "#94a3b8" }}>Log In</Link>
        <Link href={register} style={{ textDecoration: "none", color: "#94a3b8" }}>Sign Up</Link>
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
        {techStack.map((tech) => (
          <Chip key={tech} label={tech} size="small" sx={{ backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#60a5fa", border: "1px solid rgba(59, 130, 246, 0.2)", fontWeight: 500 }} />
        ))}
      </Stack>
      <Typography variant="body2" color="text.secondary">Built with passion for immersive education</Typography>
    </Box>
  );
}
