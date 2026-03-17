import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0f1e",
      paper: "rgba(21, 27, 46, 0.8)",
    },
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    secondary: {
      main: "#06b6d4",
      light: "#22d3ee",
      dark: "#0891b2",
    },
    info: {
      main: "#8b5cf6",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: "10px 24px" },
        containedPrimary: {
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
          "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)" },
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(21, 27, 46, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
        },
      },
    },
  },
});

export default theme;
