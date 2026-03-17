import { Box } from "@mui/material";

export default function AuroraBackground() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
          animation: "aurora 15s ease-in-out infinite alternate",
        },
        "@keyframes aurora": {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "100%": { transform: "translate(-5%, 5%) rotate(3deg)" },
        },
      }}
    />
  );
}
