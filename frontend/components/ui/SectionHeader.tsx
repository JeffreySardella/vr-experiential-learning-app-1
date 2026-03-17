import { Typography, Box } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  align?: "left" | "center";
}

export default function SectionHeader({ title, subtitle, gradient = false, align = "left" }: SectionHeaderProps) {
  return (
    <Box sx={{ textAlign: align, mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: subtitle ? 1 : 0,
          ...(gradient && {
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }),
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
