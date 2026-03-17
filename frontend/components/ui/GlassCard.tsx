import { Card, CardProps } from "@mui/material";

interface GlassCardProps extends CardProps {
  glow?: boolean;
}

export default function GlassCard({ glow = false, sx, children, ...props }: GlassCardProps) {
  return (
    <Card
      sx={{
        background: "rgba(21, 27, 46, 0.6)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(59, 130, 246, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": glow
          ? {
              transform: "translateY(-4px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 8px 32px rgba(59, 130, 246, 0.15)",
            }
          : {},
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}
