import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { login, register, root } from "@/links/links";

export default function NavBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(10, 15, 30, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(59, 130, 246, 0.1)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", maxWidth: "lg", width: "100%", mx: "auto" }}>
        <Link href={root} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
          >
            Academ-VR
          </Typography>
        </Link>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Link href={login} style={{ textDecoration: "none" }}>
            <Button variant="text" sx={{ color: "#94a3b8", "&:hover": { color: "#f1f5f9" } }}>
              Log In
            </Button>
          </Link>
          <Link href={register} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)" },
              }}
            >
              Sign Up
            </Button>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
