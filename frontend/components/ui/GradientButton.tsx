import { Button, ButtonProps } from "@mui/material";

export default function GradientButton({ sx, children, ...props }: ButtonProps) {
  return (
    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        color: "#fff",
        fontWeight: 600,
        padding: "10px 28px",
        borderRadius: "8px",
        "&:hover": {
          background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
