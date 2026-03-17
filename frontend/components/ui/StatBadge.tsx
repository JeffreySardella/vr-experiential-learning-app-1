import { Box, Typography } from "@mui/material";

interface StatBadgeProps {
  label: string;
  value: string | number;
  color?: "primary" | "secondary" | "info";
}

const colorMap = {
  primary: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
  secondary: { bg: "rgba(6, 182, 212, 0.15)", text: "#22d3ee" },
  info: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa" },
};

export default function StatBadge({ label, value, color = "primary" }: StatBadgeProps) {
  const colors = colorMap[color];
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.5, borderRadius: "20px", backgroundColor: colors.bg }}>
      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600 }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  );
}
