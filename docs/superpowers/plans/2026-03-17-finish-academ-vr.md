# Academ-VR Complete Project Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform a partially-built VR educational platform into a polished, portfolio-ready application with full student experience, VR video playback, quizzes, analytics, and a futuristic dark theme.

**Architecture:** Django REST backend with Next.js 14 (Pages Router) frontend. MUI component library with custom dark theme. A-Frame for 360° VR video. JWT cookie auth with role-based access (admin, instructor, student). SQLite database.

**Tech Stack:** Django 5.x, DRF, Next.js 14, React 18, MUI 5, A-Frame, Framer Motion, Recharts, Tailwind CSS, Pillow

**Spec:** `docs/superpowers/specs/2026-03-17-finish-project-design.md`

---

## Chunk 1: Visual Identity & Design System

### Task 1: Install Frontend Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install new packages**

```bash
cd frontend
npm install aframe framer-motion recharts
npm install @fontsource/inter
```

- [ ] **Step 2: Uninstall react-vr-player**

```bash
cd frontend
npm uninstall react-vr-player
```

- [ ] **Step 3: Verify package.json updated**

```bash
cd frontend && cat package.json | grep -E "aframe|framer-motion|recharts|fontsource|react-vr-player"
```

Expected: aframe, framer-motion, recharts, @fontsource/inter present. react-vr-player absent.

- [ ] **Step 4: Commit**

```bash
cd frontend
git add package.json package-lock.json
git commit -m "feat: add aframe, framer-motion, recharts; remove react-vr-player"
```

---

### Task 2: Create MUI Dark Theme

**Files:**
- Create: `frontend/styles/theme.ts`
- Modify: `frontend/pages/_app.tsx`

- [ ] **Step 1: Create theme file**

Create `frontend/styles/theme.ts`:

```typescript
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
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
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
```

- [ ] **Step 2: Update _app.tsx with ThemeProvider and Inter font**

Replace `frontend/pages/_app.tsx`:

```typescript
import "@/styles/globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import theme from "@/styles/theme";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ paddingTop: "64px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Update globals.css for dark background**

Replace `frontend/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0f1e;
  --foreground: #f1f5f9;
}

html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--background);
  color: var(--foreground);
  font-family: "Inter", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0a0f1e;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
```

- [ ] **Step 4: Verify dev server compiles**

```bash
cd frontend && npm run dev
```

Expected: Compiles without errors. Pages render with dark background.

- [ ] **Step 5: Commit**

```bash
git add frontend/styles/theme.ts frontend/pages/_app.tsx frontend/styles/globals.css
git commit -m "feat: add dark theme with MUI ThemeProvider, Inter font, page transitions"
```

---

### Task 3: Create Reusable Styled Components

**Files:**
- Create: `frontend/components/ui/GlassCard.tsx`
- Create: `frontend/components/ui/GradientButton.tsx`
- Create: `frontend/components/ui/SectionHeader.tsx`
- Create: `frontend/components/ui/StatBadge.tsx`
- Create: `frontend/components/ui/PageContainer.tsx`

- [ ] **Step 1: Create GlassCard component**

Create `frontend/components/ui/GlassCard.tsx`:

```typescript
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
```

- [ ] **Step 2: Create GradientButton component**

Create `frontend/components/ui/GradientButton.tsx`:

```typescript
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
```

- [ ] **Step 3: Create SectionHeader component**

Create `frontend/components/ui/SectionHeader.tsx`:

```typescript
import { Typography, Box } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: boolean;
  align?: "left" | "center";
}

export default function SectionHeader({
  title,
  subtitle,
  gradient = false,
  align = "left",
}: SectionHeaderProps) {
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
```

- [ ] **Step 4: Create StatBadge component**

Create `frontend/components/ui/StatBadge.tsx`:

```typescript
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
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 0.5,
        borderRadius: "20px",
        backgroundColor: colors.bg,
      }}
    >
      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
```

- [ ] **Step 5: Create PageContainer component**

Create `frontend/components/ui/PageContainer.tsx`:

```typescript
import { Container, ContainerProps } from "@mui/material";

export default function PageContainer({ sx, children, ...props }: ContainerProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        minHeight: "calc(100vh - 64px)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/components/ui/
git commit -m "feat: add reusable UI components (GlassCard, GradientButton, SectionHeader, StatBadge, PageContainer)"
```

---

### Task 4: Move NavBar to _app.tsx and Restyle

**Files:**
- Modify: `frontend/components/NavBar.tsx`
- Modify: `frontend/links/links.ts`
- Modify: `frontend/pages/_document.tsx` — remove NavBar (it runs server-side and won't pick up MUI theme)
- Modify: `frontend/pages/_app.tsx` — add NavBar here instead

- [ ] **Step 1: Update links.ts with new routes**

Replace `frontend/links/links.ts`:

```typescript
export const root = "/";
export const login = "/auth/login";
export const register = "/auth/register";
export const dashboardAdmin = "/dashboard/admin";
export const dashboardInstructor = "/dashboard/instructor";
export const dashboardStudent = "/dashboard/student";
```

- [ ] **Step 2: Remove NavBar from _document.tsx**

Replace `frontend/pages/_document.tsx`:

```typescript
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 3: Add NavBar to _app.tsx**

In `frontend/pages/_app.tsx`, add `import NavBar from "@/components/NavBar";` and render `<NavBar />` above the motion.div inside the ThemeProvider. The NavBar now lives client-side where it picks up the MUI theme.

- [ ] **Step 4: Restyle NavBar**

Replace `frontend/components/NavBar.tsx`:

```typescript
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
            <Button
              variant="text"
              sx={{ color: "#94a3b8", "&:hover": { color: "#f1f5f9" } }}
            >
              Log In
            </Button>
          </Link>
          <Link href={register} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
                },
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
```

- [ ] **Step 5: Verify NavBar renders correctly**

```bash
cd frontend && npm run dev
```

Expected: Dark glassmorphism navbar with gradient "Academ-VR" logo, "Log In" and "Sign Up" buttons.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/NavBar.tsx frontend/links/links.ts frontend/pages/_document.tsx frontend/pages/_app.tsx
git commit -m "feat: move navbar to _app.tsx, restyle with dark glassmorphism theme"
```

---

## Chunk 2: Landing Page

### Task 5: Build Landing Page Hero Section

**Files:**
- Create: `frontend/components/landing/HeroSection.tsx`
- Create: `frontend/components/landing/AuroraBackground.tsx`
- Modify: `frontend/pages/index.tsx`

- [ ] **Step 1: Create AuroraBackground component**

Create `frontend/components/landing/AuroraBackground.tsx`:

```typescript
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
```

- [ ] **Step 2: Create HeroSection component**

Create `frontend/components/landing/HeroSection.tsx`:

```typescript
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
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "2rem", md: "3.5rem" },
            background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Experience Learning in a New Dimension
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 5, maxWidth: 600, mx: "auto", fontWeight: 400 }}
        >
          Immersive 360° VR content for universities. Explore, learn, and track
          your progress — all from your browser.
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
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.1)",
                  boxShadow: "none",
                },
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
```

- [ ] **Step 3: Update index.tsx to show landing page**

Replace `frontend/pages/index.tsx`:

```typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeroSection from "@/components/landing/HeroSection";
import { dashboardAdmin, dashboardInstructor, dashboardStudent } from "@/links/links";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/auth/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          const isAdmin = userData.groups.some(
            (group: { name: string }) => group.name === "admin"
          );
          const isInstructor = userData.groups.some(
            (group: { name: string }) => group.name === "instructor"
          );
          if (isAdmin) {
            router.push(dashboardAdmin);
          } else if (isInstructor) {
            router.push(dashboardInstructor);
          } else {
            router.push(dashboardStudent);
          }
          return;
        }
      } catch {
        // Not authenticated — show landing
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <main>
      <HeroSection />
    </main>
  );
};

export default Home;
```

- [ ] **Step 4: Verify hero section renders**

```bash
cd frontend && npm run dev
```

Expected: Full-screen hero with gradient text, aurora background, two buttons.

- [ ] **Step 5: Commit**

```bash
git add frontend/components/landing/ frontend/pages/index.tsx
git commit -m "feat: add landing page hero section with aurora background"
```

---

### Task 6: Build Landing Page Features & How It Works Sections

**Files:**
- Create: `frontend/components/landing/FeaturesSection.tsx`
- Create: `frontend/components/landing/HowItWorksSection.tsx`
- Modify: `frontend/pages/index.tsx`

- [ ] **Step 1: Create FeaturesSection component**

Create `frontend/components/landing/FeaturesSection.tsx`:

```typescript
import { Box, Grid, Typography, CardContent } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import RouteIcon from "@mui/icons-material/Route";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const features = [
  {
    icon: <ViewInArIcon sx={{ fontSize: 40, color: "#3b82f6" }} />,
    title: "360° Immersive Content",
    description: "Experience virtual environments with full panoramic VR video playback directly in your browser.",
  },
  {
    icon: <RouteIcon sx={{ fontSize: 40, color: "#06b6d4" }} />,
    title: "Structured Learning Paths",
    description: "Content organized by institution, program, course, and subject for clear academic progression.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />,
    title: "Track Your Progress",
    description: "Monitor video completion, take timestamped notes, and test knowledge with built-in quizzes.",
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 40, color: "#22d3ee" }} />,
    title: "Built for Institutions",
    description: "Multi-tenant platform supporting multiple universities, programs, and role-based access control.",
  },
];

export default function FeaturesSection() {
  return (
    <Box sx={{ py: 12, px: 3 }}>
      <SectionHeader
        title="Why Academ-VR?"
        subtitle="A complete platform for immersive educational experiences"
        align="center"
        gradient
      />
      <Grid container spacing={3} maxWidth="lg" sx={{ mx: "auto" }}>
        {features.map((f) => (
          <Grid item xs={12} sm={6} md={3} key={f.title}>
            <GlassCard glow sx={{ height: "100%" }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Box sx={{ mb: 2 }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {f.description}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Create HowItWorksSection component**

Create `frontend/components/landing/HowItWorksSection.tsx`:

```typescript
import { Box, Grid, Typography } from "@mui/material";
import SectionHeader from "@/components/ui/SectionHeader";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const steps = [
  {
    icon: <SchoolIcon sx={{ fontSize: 48, color: "#3b82f6" }} />,
    number: "01",
    title: "Enroll in a Course",
    description: "Sign up, choose your institution and program, then join courses with a simple access code.",
  },
  {
    icon: <PlayCircleIcon sx={{ fontSize: 48, color: "#06b6d4" }} />,
    number: "02",
    title: "Watch VR Content",
    description: "Dive into 360° immersive videos. Take notes, explore chapter markers, and learn at your pace.",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 48, color: "#8b5cf6" }} />,
    number: "03",
    title: "Track Your Progress",
    description: "Complete quizzes, monitor your progress across courses, and achieve your learning goals.",
  },
];

export default function HowItWorksSection() {
  return (
    <Box sx={{ py: 12, px: 3, background: "rgba(15, 23, 42, 0.5)" }}>
      <SectionHeader
        title="How It Works"
        subtitle="Three simple steps to start your immersive learning journey"
        align="center"
        gradient
      />
      <Grid container spacing={4} maxWidth="md" sx={{ mx: "auto" }}>
        {steps.map((step) => (
          <Grid item xs={12} md={4} key={step.number}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                {step.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#3b82f6", fontWeight: 700, letterSpacing: 2 }}
              >
                STEP {step.number}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, mb: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 3: Add sections to index.tsx**

In `frontend/pages/index.tsx`, add imports and render the new sections after HeroSection:

```typescript
// Add to imports:
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

// In the return, after <HeroSection />:
return (
  <main>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
  </main>
);
```

- [ ] **Step 4: Verify sections render**

```bash
cd frontend && npm run dev
```

Expected: Scrollable landing page with hero → features grid → how it works steps.

- [ ] **Step 5: Commit**

```bash
git add frontend/components/landing/FeaturesSection.tsx frontend/components/landing/HowItWorksSection.tsx frontend/pages/index.tsx
git commit -m "feat: add features and how-it-works sections to landing page"
```

---

### Task 7: Build Landing Page Role Showcase & Footer

**Files:**
- Create: `frontend/components/landing/RoleShowcase.tsx`
- Create: `frontend/components/landing/Footer.tsx`
- Modify: `frontend/pages/index.tsx`

- [ ] **Step 1: Create RoleShowcase component**

Create `frontend/components/landing/RoleShowcase.tsx`:

```typescript
import { Box, Grid, Typography, CardContent } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const roles = [
  {
    icon: <PersonIcon sx={{ fontSize: 36, color: "#3b82f6" }} />,
    title: "Students",
    items: ["Enroll in courses", "Watch 360° VR videos", "Take notes & quizzes", "Track progress"],
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 36, color: "#06b6d4" }} />,
    title: "Instructors",
    items: ["Upload VR content", "Organize by subject", "Create quizzes", "Post announcements"],
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#8b5cf6" }} />,
    title: "Administrators",
    items: ["Manage institutions", "Invite users", "View analytics", "Control access"],
  },
];

export default function RoleShowcase() {
  return (
    <Box sx={{ py: 12, px: 3 }}>
      <SectionHeader
        title="Built for Every Role"
        subtitle="Each user gets a tailored experience"
        align="center"
        gradient
      />
      <Grid container spacing={3} maxWidth="lg" sx={{ mx: "auto" }}>
        {roles.map((role) => (
          <Grid item xs={12} md={4} key={role.title}>
            <GlassCard glow sx={{ height: "100%" }}>
              <CardContent sx={{ py: 4, px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  {role.icon}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {role.title}
                  </Typography>
                </Box>
                {role.items.map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 0.5, pl: 2, borderLeft: "2px solid rgba(59, 130, 246, 0.3)" }}
                  >
                    {item}
                  </Typography>
                ))}
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `frontend/components/landing/Footer.tsx`:

```typescript
import { Box, Typography, Stack, Chip } from "@mui/material";
import Link from "next/link";
import { login, register } from "@/links/links";

const techStack = ["Next.js", "Django", "A-Frame", "React", "MUI", "DRF"];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        borderTop: "1px solid rgba(59, 130, 246, 0.1)",
        background: "rgba(10, 15, 30, 0.9)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          display: "inline-block",
        }}
      >
        Academ-VR
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 3 }}>
        <Link href={login} style={{ textDecoration: "none", color: "#94a3b8" }}>
          Log In
        </Link>
        <Link href={register} style={{ textDecoration: "none", color: "#94a3b8" }}>
          Sign Up
        </Link>
      </Stack>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mb: 3 }}>
        {techStack.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              fontWeight: 500,
            }}
          />
        ))}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Built with passion for immersive education
      </Typography>
    </Box>
  );
}
```

- [ ] **Step 3: Add sections to index.tsx**

In `frontend/pages/index.tsx`, add imports and render after HowItWorksSection:

```typescript
// Add to imports:
import RoleShowcase from "@/components/landing/RoleShowcase";
import Footer from "@/components/landing/Footer";

// In the return:
return (
  <main>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <RoleShowcase />
    <Footer />
  </main>
);
```

- [ ] **Step 4: Verify complete landing page**

```bash
cd frontend && npm run dev
```

Expected: Full scrolling landing page — hero → features → how it works → role showcase → footer.

- [ ] **Step 5: Commit**

```bash
git add frontend/components/landing/RoleShowcase.tsx frontend/components/landing/Footer.tsx frontend/pages/index.tsx
git commit -m "feat: complete landing page with role showcase and footer"
```

---

## Chunk 3: Authentication Pages & Guards

### Task 8: Build Fetch Wrapper with CSRF & Auth

**Files:**
- Create: `frontend/lib/api.ts`

- [ ] **Step 1: Create API helper with CSRF handling**

Create `frontend/lib/api.ts`:

```typescript
function getCsrfToken(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

interface ApiOptions extends RequestInit {
  json?: unknown;
}

export async function api(path: string, options: ApiOptions = {}): Promise<Response> {
  const { json, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (json) {
    headers["Content-Type"] = "application/json";
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  return fetch(`${process.env.API_URL}${path}`, {
    credentials: "include",
    headers,
    body: json ? JSON.stringify(json) : options.body,
    ...rest,
  });
}

export async function apiGet(path: string) {
  return api(path, { method: "GET" });
}

export async function apiPost(path: string, data?: unknown) {
  return api(path, { method: "POST", json: data });
}

export async function apiPatch(path: string, data?: unknown) {
  return api(path, { method: "PATCH", json: data });
}

export async function apiPut(path: string, data?: unknown) {
  return api(path, { method: "PUT", json: data });
}

export async function apiDelete(path: string) {
  return api(path, { method: "DELETE" });
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/lib/api.ts
git commit -m "feat: add fetch wrapper with CSRF token handling"
```

---

### Task 8b: Enable CSRF Protection in Django

**Files:**
- Modify: `backend/backend/settings.py`

- [ ] **Step 1: Add CsrfViewMiddleware and fix duplicate middleware**

In `backend/backend/settings.py`:
- Remove the duplicate `django.middleware.common.CommonMiddleware` entry
- Add `django.middleware.csrf.CsrfViewMiddleware` after `SessionMiddleware`
- Set `JWT_AUTH_COOKIE_USE_CSRF` to `True` in the `REST_AUTH` dict
- Add `CSRF_COOKIE_HTTPONLY = False` (so the frontend JS can read the csrftoken cookie)

- [ ] **Step 2: Verify backend still starts**

```bash
cd backend && source venv/Scripts/activate && python manage.py runserver
```

Expected: No errors. CSRF cookie will now be set on responses.

- [ ] **Step 3: Commit**

```bash
git add backend/backend/settings.py
git commit -m "feat: enable CSRF protection for JWT cookie auth"
```

---

### Task 9: Build Auth Guard HOC

**Files:**
- Create: `frontend/lib/auth.tsx`

- [ ] **Step 1: Create withAuth HOC**

Create `frontend/lib/auth.tsx`:

```typescript
import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/router";
import { apiGet } from "@/lib/api";
import { login, dashboardAdmin, dashboardInstructor, dashboardStudent } from "@/links/links";
import { Box, CircularProgress } from "@mui/material";

type Role = "admin" | "instructor" | "student";

interface UserData {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: { name: string }[];
  institution: number | null;
  programs: number[];
  courses: number[];
}

const roleDashboard: Record<Role, string> = {
  admin: dashboardAdmin,
  instructor: dashboardInstructor,
  student: dashboardStudent,
};

function getUserRole(groups: { name: string }[]): Role | null {
  if (groups.some((g) => g.name === "admin")) return "admin";
  if (groups.some((g) => g.name === "instructor")) return "instructor";
  if (groups.some((g) => g.name === "student")) return "student";
  return null;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P & { user: UserData }>,
  allowedRoles: Role[]
) {
  return function AuthGuardedComponent(props: P) {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      const check = async () => {
        try {
          const res = await apiGet("/api/auth/user");
          if (!res.ok) {
            router.replace(login);
            return;
          }
          const data: UserData = await res.json();
          const role = getUserRole(data.groups);

          if (!role || !allowedRoles.includes(role)) {
            router.replace(roleDashboard[role ?? "student"]);
            return;
          }
          setUser(data);
        } catch {
          router.replace(login);
        }
        setChecked(true);
      };
      check();
    }, [router]);

    if (!checked || !user) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/lib/auth.tsx
git commit -m "feat: add withAuth HOC for role-based route protection"
```

---

### Task 10: Restyle Login Page

**Files:**
- Modify: `frontend/pages/auth/login.tsx`

- [ ] **Step 1: Read current login page**

Read `frontend/pages/auth/login.tsx` to understand current structure.

- [ ] **Step 2: Rewrite login page with dark theme**

Replace `frontend/pages/auth/login.tsx`:

```typescript
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Typography, Alert, Link as MuiLink } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { apiPost } from "@/lib/api";
import { dashboardAdmin, dashboardInstructor, dashboardStudent, register } from "@/links/links";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiPost("/api/auth/login/", { email, password });
      if (res.ok) {
        const userData = await res.json();
        const groups = userData.user?.groups || [];
        const isAdmin = groups.some((g: { name: string }) => g.name === "admin");
        const isInstructor = groups.some((g: { name: string }) => g.name === "instructor");
        if (isAdmin) router.push(dashboardAdmin);
        else if (isInstructor) router.push(dashboardInstructor);
        else router.push(dashboardStudent);
      } else {
        const data = await res.json();
        setError(data.non_field_errors?.[0] || "Invalid email or password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <AuroraBackground />
      <GlassCard sx={{ position: "relative", zIndex: 1, p: 5, maxWidth: 420, width: "100%" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: "center",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          Sign in to your Academ-VR account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <GradientButton type="submit" fullWidth disabled={loading} sx={{ mb: 2 }}>
            {loading ? "Signing in..." : "Sign In"}
          </GradientButton>
        </form>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Link href={register} passHref legacyBehavior>
              <MuiLink sx={{ color: "#3b82f6" }}>Sign Up</MuiLink>
            </Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Received an invite?{" "}
            <Link href="/auth/admin/signup" passHref legacyBehavior>
              <MuiLink sx={{ color: "#06b6d4" }}>Admin</MuiLink>
            </Link>
            {" / "}
            <Link href="/auth/instructor/signup" passHref legacyBehavior>
              <MuiLink sx={{ color: "#06b6d4" }}>Instructor</MuiLink>
            </Link>
          </Typography>
        </Box>
      </GlassCard>
    </Box>
  );
}
```

- [ ] **Step 3: Verify login page renders**

```bash
cd frontend && npm run dev
```

Navigate to `/auth/login`. Expected: Centered glass card on aurora background with gradient header.

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/auth/login.tsx
git commit -m "feat: restyle login page with dark glassmorphism theme"
```

---

### Task 11: Build Student Registration Page

**Files:**
- Create: `frontend/pages/auth/register.tsx`

- [ ] **Step 1: Create multi-step student registration page**

Create `frontend/pages/auth/register.tsx`:

```typescript
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box, TextField, Typography, Stepper, Step, StepLabel,
  Select, MenuItem, FormControl, InputLabel, Alert, Button,
  Chip, Stack
} from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { apiGet, apiPost } from "@/lib/api";
import { dashboardStudent, login } from "@/links/links";
import Link from "next/link";

const steps = ["Account", "Institution", "Courses"];

interface Institution {
  id: number;
  name: string;
}

interface Program {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Step 2
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [institutionId, setInstitutionId] = useState<number | "">("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programIds, setProgramIds] = useState<number[]>([]);

  // Step 3
  const [courseName, setCourseName] = useState("");
  const [coursePassword, setCoursePassword] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  useEffect(() => {
    apiGet("/api/institutions/").then(async (res) => {
      if (res.ok) setInstitutions(await res.json());
    });
  }, []);

  useEffect(() => {
    if (institutionId) {
      apiGet(`/api/institutions/${institutionId}/programs/`).then(async (res) => {
        if (res.ok) setPrograms(await res.json());
      });
    }
  }, [institutionId]);

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await apiPost("/api/auth/register/students/", {
        email,
        password1: password,
        password2: password2,
        first_name: firstName,
        last_name: lastName,
        institution_id: institutionId,
        program_ids: programIds,
      });
      if (res.ok) {
        setActiveStep(2);
      } else {
        const data = await res.json();
        const firstError = Object.values(data).flat()[0];
        setError(typeof firstError === "string" ? firstError : "Registration failed.");
      }
    } catch {
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  const handleEnrollCourse = async () => {
    setError("");
    try {
      const res = await apiPost("/api/institutions/add_course/", {
        course_name: courseName,
        course_password: coursePassword,
      });
      if (res.ok) {
        setEnrolledCourses([...enrolledCourses, courseName]);
        setCourseName("");
        setCoursePassword("");
      } else {
        setError("Could not enroll. Check course name and password.");
      }
    } catch {
      setError("Something went wrong.");
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </Stack>
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirm Password" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required sx={{ mb: 3 }} />
            <GradientButton fullWidth onClick={() => {
              if (password !== password2) { setError("Passwords don't match"); return; }
              setError(""); setActiveStep(1);
            }}>
              Next
            </GradientButton>
          </>
        );
      case 1:
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Institution</InputLabel>
              <Select value={institutionId} onChange={(e) => setInstitutionId(e.target.value as number)} label="Institution">
                {institutions.map((i) => (
                  <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Programs</InputLabel>
              <Select
                multiple
                value={programIds}
                onChange={(e) => setProgramIds(e.target.value as number[])}
                label="Programs"
                renderValue={(selected) => (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(selected as number[]).map((id) => (
                      <Chip key={id} label={programs.find((p) => p.id === id)?.name} size="small" />
                    ))}
                  </Stack>
                )}
              >
                {programs.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setActiveStep(0)} sx={{ flex: 1 }}>Back</Button>
              <GradientButton sx={{ flex: 1 }} onClick={handleRegister} disabled={loading || !institutionId || programIds.length === 0}>
                {loading ? "Creating account..." : "Create Account"}
              </GradientButton>
            </Stack>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your account is ready! Optionally enroll in courses now, or skip and do it later from your dashboard.
            </Typography>
            {enrolledCourses.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {enrolledCourses.map((c) => (
                  <Chip key={c} label={c} color="primary" size="small" />
                ))}
              </Stack>
            )}
            <TextField fullWidth label="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Course Password" value={coursePassword} onChange={(e) => setCoursePassword(e.target.value)} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleEnrollCourse} sx={{ flex: 1 }} disabled={!courseName}>
                Enroll
              </Button>
              <GradientButton sx={{ flex: 1 }} onClick={() => router.push(dashboardStudent)}>
                {enrolledCourses.length > 0 ? "Continue to Dashboard" : "Skip & Go to Dashboard"}
              </GradientButton>
            </Stack>
          </>
        );
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <AuroraBackground />
      <GlassCard sx={{ position: "relative", zIndex: 1, p: 5, maxWidth: 500, width: "100%" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Join Academ-VR
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            {error}
          </Alert>
        )}
        {renderStep()}
        {activeStep === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
            Already have an account?{" "}
            <Link href={login} style={{ color: "#3b82f6", textDecoration: "none" }}>Sign In</Link>
          </Typography>
        )}
      </GlassCard>
    </Box>
  );
}
```

- [ ] **Step 2: Verify registration page renders**

```bash
cd frontend && npm run dev
```

Navigate to `/auth/register`. Expected: Multi-step form with stepper, glassmorphism card.

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/auth/register.tsx
git commit -m "feat: add multi-step student registration page with dark theme"
```

---

### Task 12: Restyle Admin & Instructor Invite Signup Pages

**Files:**
- Modify: `frontend/pages/auth/admin/signup.tsx`
- Modify: `frontend/pages/auth/instructor/signup.tsx`

- [ ] **Step 1: Read current admin signup page**

Read `frontend/pages/auth/admin/signup.tsx` to understand current structure.

- [ ] **Step 2: Restyle admin signup page**

Restyle to match the new dark theme — centered GlassCard on AuroraBackground, gradient heading, same form fields but with the new styling. Keep the uid/token logic from URL params. Show "You've been invited to join as an Admin" messaging.

- [ ] **Step 3: Read current instructor signup page**

Read `frontend/pages/auth/instructor/signup.tsx` to understand current structure.

- [ ] **Step 4: Restyle instructor signup page**

Same treatment as admin — GlassCard, AuroraBackground, dark theme. Keep program selection and uid/token logic. Show "You've been invited to join as an Instructor" messaging.

- [ ] **Step 5: Verify both pages render**

```bash
cd frontend && npm run dev
```

Navigate to `/auth/admin/signup` and `/auth/instructor/signup`. Expected: Same dark glassmorphism style as login page.

- [ ] **Step 6: Commit**

```bash
git add frontend/pages/auth/admin/signup.tsx frontend/pages/auth/instructor/signup.tsx
git commit -m "feat: restyle admin and instructor invite signup pages with dark theme"
```

---

## Chunk 4: Backend — New Models & APIs (Progress, Notes, Chapters)

### Task 13: Install Pillow Backend Dependency

**Files:**
- Modify: `backend/requirements.txt`

- [ ] **Step 1: Add Pillow to requirements**

Add `Pillow>=10.0.0` to `backend/requirements.txt`.

- [ ] **Step 2: Install**

```bash
cd backend && source venv/Scripts/activate && pip install Pillow>=10.0.0
```

- [ ] **Step 3: Commit**

```bash
git add backend/requirements.txt
git commit -m "feat: add Pillow dependency for image/thumbnail handling"
```

---

### Task 14: Add New Fields to Existing Models

**Files:**
- Modify: `backend/institution/models.py`
- Modify: `backend/video/models.py`

- [ ] **Step 1: Add is_visible to Course and Subject, pinned to Announcement**

In `backend/institution/models.py`:

Add to the `Course` model:
```python
is_visible = models.BooleanField(default=True)
```

Add to the `Subject` model:
```python
is_visible = models.BooleanField(default=True)
```

Add to the `Announcement` model:
```python
pinned = models.BooleanField(default=False)
```

- [ ] **Step 2: Add duration_seconds and thumbnail to Video**

In `backend/video/models.py`:

Add to the `Video` model:
```python
duration_seconds = models.IntegerField(null=True, blank=True)
thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
```

- [ ] **Step 3: Create and apply migrations**

```bash
cd backend && source venv/Scripts/activate && python manage.py makemigrations && python manage.py migrate
```

- [ ] **Step 4: Commit**

```bash
git add backend/institution/models.py backend/video/models.py backend/institution/migrations/ backend/video/migrations/
git commit -m "feat: add is_visible, pinned, duration_seconds, thumbnail fields"
```

---

### Task 15: Create VideoProgress Model

**Files:**
- Create: `backend/video/progress_models.py` — No, follow the existing pattern and add to `backend/video/models.py`
- Modify: `backend/video/models.py`

- [ ] **Step 1: Add VideoProgress model**

In `backend/video/models.py`, add:

```python
class VideoProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='video_progress'
    )
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='progress')
    course = models.ForeignKey('institution.Course', on_delete=models.CASCADE, related_name='video_progress')
    watched = models.BooleanField(default=False)
    progress_percent = models.FloatField(default=0)
    last_watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'video', 'course')
        verbose_name_plural = 'Video progress'

    def __str__(self):
        return f'{self.user} - {self.video} ({self.progress_percent}%)'
```

Add `from django.conf import settings` at the top if not already imported.

- [ ] **Step 2: Create and apply migration**

```bash
cd backend && source venv/Scripts/activate && python manage.py makemigrations video && python manage.py migrate
```

- [ ] **Step 3: Commit**

```bash
git add backend/video/models.py backend/video/migrations/
git commit -m "feat: add VideoProgress model with user/video/course tracking"
```

---

### Task 16: Create VideoNote Model

**Files:**
- Modify: `backend/video/models.py`

- [ ] **Step 1: Add VideoNote model**

In `backend/video/models.py`, add:

```python
class VideoNote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='video_notes'
    )
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='notes')
    timestamp_seconds = models.IntegerField()
    text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp_seconds']

    def __str__(self):
        return f'Note at {self.timestamp_seconds}s by {self.user}'
```

- [ ] **Step 2: Create and apply migration**

```bash
cd backend && source venv/Scripts/activate && python manage.py makemigrations video && python manage.py migrate
```

- [ ] **Step 3: Commit**

```bash
git add backend/video/models.py backend/video/migrations/
git commit -m "feat: add VideoNote model for timestamped student notes"
```

---

### Task 17: Create ChapterMarker Model

**Files:**
- Modify: `backend/video/models.py`

- [ ] **Step 1: Add ChapterMarker model**

In `backend/video/models.py`, add:

```python
class ChapterMarker(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='chapters')
    timestamp_seconds = models.IntegerField()
    label = models.CharField(max_length=100)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_chapters'
    )

    class Meta:
        ordering = ['timestamp_seconds']

    def __str__(self):
        return f'{self.label} at {self.timestamp_seconds}s'
```

- [ ] **Step 2: Create and apply migration**

```bash
cd backend && source venv/Scripts/activate && python manage.py makemigrations video && python manage.py migrate
```

- [ ] **Step 3: Commit**

```bash
git add backend/video/models.py backend/video/migrations/
git commit -m "feat: add ChapterMarker model for video navigation points"
```

---

### Task 18: Build Progress API Endpoints

**Files:**
- Create: `backend/video/progress_serializers.py`
- Create: `backend/video/progress_apis.py`
- Modify: `backend/video/urls.py`

- [ ] **Step 1: Create progress serializers**

Create `backend/video/progress_serializers.py`:

```python
from rest_framework import serializers
from video.models import VideoProgress

class VideoProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoProgress
        fields = ['id', 'video', 'course', 'watched', 'progress_percent', 'last_watched_at']
        read_only_fields = ['id', 'last_watched_at']

class VideoProgressUpdateSerializer(serializers.Serializer):
    video = serializers.IntegerField()
    course = serializers.IntegerField()
    progress_percent = serializers.FloatField(min_value=0, max_value=100)
    watched = serializers.BooleanField(required=False, default=False)
```

- [ ] **Step 2: Create progress APIs**

Create `backend/video/progress_apis.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from video.models import VideoProgress, Video
from institution.models import Course
from video.progress_serializers import VideoProgressSerializer, VideoProgressUpdateSerializer

class ProgressApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = VideoProgress.objects.filter(user=request.user)
        return Response(VideoProgressSerializer(progress, many=True).data)

    def post(self, request):
        serializer = VideoProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        video = Video.objects.get(id=data['video'])
        course = Course.objects.get(id=data['course'])

        progress, _ = VideoProgress.objects.update_or_create(
            user=request.user, video=video, course=course,
            defaults={
                'progress_percent': data['progress_percent'],
                'watched': data.get('watched', False) or data['progress_percent'] >= 80,
            }
        )
        return Response(VideoProgressSerializer(progress).data, status=status.HTTP_200_OK)

class ProgressByCourseApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        progress = VideoProgress.objects.filter(user=request.user, course_id=course_id)
        return Response(VideoProgressSerializer(progress, many=True).data)

class RecentActivityApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        recent = VideoProgress.objects.filter(
            user=request.user, last_watched_at__isnull=False
        ).select_related('video', 'course').order_by('-last_watched_at')[:10]
        data = [{
            'video_id': p.video.id,
            'video_title': p.video.title,
            'course_id': p.course.id,
            'course_name': p.course.name,
            'progress_percent': p.progress_percent,
            'watched': p.watched,
            'last_watched_at': p.last_watched_at,
        } for p in recent]
        return Response(data)
```

- [ ] **Step 3: Add progress URLs**

In `backend/video/urls.py`, add the progress routes:

```python
from video.progress_apis import ProgressApi, ProgressByCourseApi, RecentActivityApi

# Add these urlpatterns:
path('progress/', ProgressApi.as_view()),
path('progress/recent/', RecentActivityApi.as_view()),
path('progress/course/<int:course_id>/', ProgressByCourseApi.as_view()),
```

- [ ] **Step 4: Verify endpoints via Swagger**

```bash
cd backend && source venv/Scripts/activate && python manage.py runserver
```

Check http://localhost:8000/swagger — new progress endpoints should appear.

- [ ] **Step 5: Commit**

```bash
git add backend/video/progress_serializers.py backend/video/progress_apis.py backend/video/urls.py
git commit -m "feat: add progress tracking API endpoints"
```

---

### Task 19: Build Notes API Endpoints

**Files:**
- Create: `backend/video/notes_serializers.py`
- Create: `backend/video/notes_apis.py`
- Modify: `backend/video/urls.py`

- [ ] **Step 1: Create notes serializers**

Create `backend/video/notes_serializers.py`:

```python
from rest_framework import serializers
from video.models import VideoNote

class VideoNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoNote
        fields = ['id', 'video', 'timestamp_seconds', 'text', 'created_at']
        read_only_fields = ['id', 'video', 'created_at']

class VideoNoteCreateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0)
    text = serializers.CharField(max_length=500)
```

- [ ] **Step 2: Create notes APIs**

Create `backend/video/notes_apis.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from video.models import VideoNote, Video
from video.notes_serializers import VideoNoteSerializer, VideoNoteCreateSerializer

class VideoNotesApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, video_id):
        notes = VideoNote.objects.filter(user=request.user, video_id=video_id)
        return Response(VideoNoteSerializer(notes, many=True).data)

    def post(self, request, video_id):
        serializer = VideoNoteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        video = Video.objects.get(id=video_id)
        note = VideoNote.objects.create(
            user=request.user,
            video=video,
            **serializer.validated_data
        )
        return Response(VideoNoteSerializer(note).data, status=status.HTTP_201_CREATED)

class VideoNoteByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, video_id, note_id):
        note = VideoNote.objects.get(id=note_id, user=request.user, video_id=video_id)
        if 'text' in request.data:
            note.text = request.data['text']
        if 'timestamp_seconds' in request.data:
            note.timestamp_seconds = request.data['timestamp_seconds']
        note.save()
        return Response(VideoNoteSerializer(note).data)

    def delete(self, request, video_id, note_id):
        VideoNote.objects.filter(id=note_id, user=request.user, video_id=video_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

- [ ] **Step 3: Add notes URLs**

In `backend/video/urls.py`, add:

```python
from video.notes_apis import VideoNotesApi, VideoNoteByIdApi

path('<int:video_id>/notes/', VideoNotesApi.as_view()),
path('<int:video_id>/notes/<int:note_id>/', VideoNoteByIdApi.as_view()),
```

- [ ] **Step 4: Commit**

```bash
git add backend/video/notes_serializers.py backend/video/notes_apis.py backend/video/urls.py
git commit -m "feat: add video notes CRUD API endpoints"
```

---

### Task 20: Build Chapter Markers API Endpoints

**Files:**
- Create: `backend/video/chapter_serializers.py`
- Create: `backend/video/chapter_apis.py`
- Modify: `backend/video/urls.py`

- [ ] **Step 1: Create chapter serializers**

Create `backend/video/chapter_serializers.py`:

```python
from rest_framework import serializers
from video.models import ChapterMarker

class ChapterMarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChapterMarker
        fields = ['id', 'video', 'timestamp_seconds', 'label', 'created_by']
        read_only_fields = ['id', 'video', 'created_by']

class ChapterMarkerCreateSerializer(serializers.Serializer):
    timestamp_seconds = serializers.IntegerField(min_value=0)
    label = serializers.CharField(max_length=100)
```

- [ ] **Step 2: Create chapter APIs**

Create `backend/video/chapter_apis.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from custom_auth.permissions import IsInstructor, IsInternalAdmin
from video.models import ChapterMarker, Video
from video.chapter_serializers import ChapterMarkerSerializer, ChapterMarkerCreateSerializer

class ChapterMarkersApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, video_id):
        markers = ChapterMarker.objects.filter(video_id=video_id)
        return Response(ChapterMarkerSerializer(markers, many=True).data)

    def post(self, request, video_id):
        if not (IsInstructor().has_permission(request, self) or IsInternalAdmin().has_permission(request, self)):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ChapterMarkerCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        video = Video.objects.get(id=video_id)
        marker = ChapterMarker.objects.create(
            video=video,
            created_by=request.user,
            **serializer.validated_data
        )
        return Response(ChapterMarkerSerializer(marker).data, status=status.HTTP_201_CREATED)

class ChapterMarkerByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, video_id, chapter_id):
        marker = ChapterMarker.objects.get(id=chapter_id, video_id=video_id)
        if 'label' in request.data:
            marker.label = request.data['label']
        if 'timestamp_seconds' in request.data:
            marker.timestamp_seconds = request.data['timestamp_seconds']
        marker.save()
        return Response(ChapterMarkerSerializer(marker).data)

    def delete(self, request, video_id, chapter_id):
        ChapterMarker.objects.filter(id=chapter_id, video_id=video_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

- [ ] **Step 3: Add chapter URLs**

In `backend/video/urls.py`, add:

```python
from video.chapter_apis import ChapterMarkersApi, ChapterMarkerByIdApi

path('<int:video_id>/chapters/', ChapterMarkersApi.as_view()),
path('<int:video_id>/chapters/<int:chapter_id>/', ChapterMarkerByIdApi.as_view()),
```

- [ ] **Step 4: Commit**

```bash
git add backend/video/chapter_serializers.py backend/video/chapter_apis.py backend/video/urls.py
git commit -m "feat: add chapter markers CRUD API endpoints"
```

---

## Chunk 5: Backend — Quiz System & Analytics

### Task 21: Create Quiz Models

**Files:**
- Create: `backend/quiz/__init__.py`
- Create: `backend/quiz/models.py`
- Create: `backend/quiz/apps.py`
- Create: `backend/quiz/admin.py`
- Modify: `backend/backend/settings.py`

- [ ] **Step 1: Create the quiz app directory**

```bash
cd backend && mkdir -p quiz
```

- [ ] **Step 2: Create quiz app files**

Create `backend/quiz/__init__.py` (empty file).

Create `backend/quiz/apps.py`:
```python
from django.apps import AppConfig

class QuizConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'quiz'
```

Create `backend/quiz/models.py`:
```python
from django.conf import settings
from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=100)
    course = models.ForeignKey('institution.Course', on_delete=models.CASCADE, related_name='quizzes')
    video = models.ForeignKey('video.Video', on_delete=models.CASCADE, null=True, blank=True, related_name='quizzes')
    subject = models.ForeignKey('institution.Subject', on_delete=models.CASCADE, null=True, blank=True, related_name='quizzes')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_quizzes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.title

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=500)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.quiz} ({self.score}%)'

class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.question} -> {self.selected_choice}'
```

Create `backend/quiz/admin.py`:
```python
from django.contrib import admin
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(QuizAttempt)
admin.site.register(QuizAnswer)
```

- [ ] **Step 3: Add quiz to INSTALLED_APPS**

In `backend/backend/settings.py`, add `'quiz'` to `INSTALLED_APPS`.

- [ ] **Step 4: Create and apply migrations**

```bash
cd backend && source venv/Scripts/activate && python manage.py makemigrations quiz && python manage.py migrate
```

- [ ] **Step 5: Commit**

```bash
git add backend/quiz/ backend/backend/settings.py
git commit -m "feat: add quiz app with Quiz, Question, Choice, QuizAttempt, QuizAnswer models"
```

---

### Task 22: Build Quiz API Endpoints

**Files:**
- Create: `backend/quiz/serializers.py`
- Create: `backend/quiz/apis.py`
- Create: `backend/quiz/urls.py`
- Modify: `backend/backend/urls.py`

- [ ] **Step 1: Create quiz serializers**

Create `backend/quiz/serializers.py`:

```python
from rest_framework import serializers
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct']

class ChoiceStudentSerializer(serializers.ModelSerializer):
    """Hides is_correct for students taking quiz"""
    class Meta:
        model = Choice
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'choices']

class QuestionStudentSerializer(serializers.ModelSerializer):
    choices = ChoiceStudentSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'video', 'subject', 'created_by', 'created_at', 'questions', 'question_count']
        read_only_fields = ['id', 'created_by', 'created_at']

class QuizListSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'course', 'video', 'subject', 'question_count', 'created_at']

class QuizCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100)
    course = serializers.IntegerField()
    video = serializers.IntegerField(required=False)
    subject = serializers.IntegerField(required=False)

class QuestionCreateSerializer(serializers.Serializer):
    text = serializers.CharField(max_length=500)
    order = serializers.IntegerField(default=0)
    choices = serializers.ListField(child=serializers.DictField())

class AttemptSubmitSerializer(serializers.Serializer):
    answers = serializers.ListField(
        child=serializers.DictField()
    )

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['question', 'selected_choice']

class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'score', 'completed_at', 'answers']
```

- [ ] **Step 2: Create quiz APIs**

Create `backend/quiz/apis.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from custom_auth.permissions import IsInstructor, IsInternalAdmin
from quiz.models import Quiz, Question, Choice, QuizAttempt, QuizAnswer
from institution.models import Course, Subject
from video.models import Video
from quiz.serializers import (
    QuizSerializer, QuizListSerializer, QuizCreateSerializer,
    QuestionCreateSerializer, AttemptSubmitSerializer,
    QuizAttemptSerializer, QuestionSerializer
)

class QuizListApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        course_id = request.query_params.get('course_id')
        quizzes = Quiz.objects.all()
        if course_id:
            quizzes = quizzes.filter(course_id=course_id)
        return Response(QuizListSerializer(quizzes, many=True).data)

    def post(self, request):
        serializer = QuizCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        course = Course.objects.get(id=data['course'])
        quiz = Quiz.objects.create(
            title=data['title'],
            course=course,
            video=Video.objects.get(id=data['video']) if 'video' in data else None,
            subject=Subject.objects.get(id=data['subject']) if 'subject' in data else None,
            created_by=request.user,
        )
        return Response(QuizSerializer(quiz).data, status=status.HTTP_201_CREATED)

class QuizByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        quiz = Quiz.objects.get(id=quiz_id)
        return Response(QuizSerializer(quiz).data)

    def patch(self, request, quiz_id):
        quiz = Quiz.objects.get(id=quiz_id)
        if 'title' in request.data:
            quiz.title = request.data['title']
        quiz.save()
        return Response(QuizSerializer(quiz).data)

    def delete(self, request, quiz_id):
        Quiz.objects.filter(id=quiz_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class QuizQuestionsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        questions = Question.objects.filter(quiz_id=quiz_id)
        return Response(QuestionSerializer(questions, many=True).data)

    def post(self, request, quiz_id):
        serializer = QuestionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        quiz = Quiz.objects.get(id=quiz_id)
        question = Question.objects.create(
            quiz=quiz, text=data['text'], order=data.get('order', 0)
        )
        for choice_data in data.get('choices', []):
            Choice.objects.create(
                question=question,
                text=choice_data['text'],
                is_correct=choice_data.get('is_correct', False),
            )
        return Response(QuestionSerializer(question).data, status=status.HTTP_201_CREATED)

class QuizQuestionByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, quiz_id, question_id):
        question = Question.objects.get(id=question_id, quiz_id=quiz_id)
        if 'text' in request.data:
            question.text = request.data['text']
        if 'order' in request.data:
            question.order = request.data['order']
        question.save()
        return Response(QuestionSerializer(question).data)

    def delete(self, request, quiz_id, question_id):
        Question.objects.filter(id=question_id, quiz_id=quiz_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class QuizAttemptApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        serializer = AttemptSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz = Quiz.objects.get(id=quiz_id)
        answers_data = serializer.validated_data['answers']

        correct = 0
        total = len(answers_data)
        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, score=0)

        for ans in answers_data:
            question = Question.objects.get(id=ans['question_id'])
            choice = Choice.objects.get(id=ans['choice_id'])
            QuizAnswer.objects.create(attempt=attempt, question=question, selected_choice=choice)
            if choice.is_correct:
                correct += 1

        attempt.score = (correct / total * 100) if total > 0 else 0
        attempt.save()
        return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)

class QuizResultsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        # Students see their own attempts, instructors/admins see all
        from custom_auth.constants import INSTRUCTOR_GROUP_NAME, ADMIN_GROUP_NAME
        user_groups = [g.name for g in request.user.groups.all()]

        if INSTRUCTOR_GROUP_NAME in user_groups or ADMIN_GROUP_NAME in user_groups:
            attempts = QuizAttempt.objects.filter(quiz_id=quiz_id).select_related('user')
        else:
            attempts = QuizAttempt.objects.filter(quiz_id=quiz_id, user=request.user)

        return Response(QuizAttemptSerializer(attempts, many=True).data)
```

- [ ] **Step 3: Create quiz URLs**

Create `backend/quiz/urls.py`:

```python
from django.urls import path
from quiz.apis import (
    QuizListApi, QuizByIdApi, QuizQuestionsApi,
    QuizQuestionByIdApi, QuizAttemptApi, QuizResultsApi
)

urlpatterns = [
    path('', QuizListApi.as_view()),
    path('<int:quiz_id>/', QuizByIdApi.as_view()),
    path('<int:quiz_id>/questions/', QuizQuestionsApi.as_view()),
    path('<int:quiz_id>/questions/<int:question_id>/', QuizQuestionByIdApi.as_view()),
    path('<int:quiz_id>/attempt/', QuizAttemptApi.as_view()),
    path('<int:quiz_id>/results/', QuizResultsApi.as_view()),
]
```

- [ ] **Step 4: Add quiz URLs to main urls.py**

In `backend/backend/urls.py`, add:

```python
path('api/quizzes/', include('quiz.urls')),
```

- [ ] **Step 5: Verify endpoints via Swagger**

```bash
cd backend && source venv/Scripts/activate && python manage.py runserver
```

Check http://localhost:8000/swagger — quiz endpoints should appear.

- [ ] **Step 6: Commit**

```bash
git add backend/quiz/ backend/backend/urls.py
git commit -m "feat: add quiz API endpoints with questions, choices, attempts, and results"
```

---

### Task 23: Build Analytics API Endpoints

**Files:**
- Create: `backend/backend/analytics_apis.py`
- Modify: `backend/backend/urls.py`

- [ ] **Step 1: Create analytics APIs**

Create `backend/backend/analytics_apis.py`:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from custom_auth.permissions import IsInternalAdmin
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from institution.models import Course
from video.models import Video, VideoProgress
from quiz.models import QuizAttempt

User = get_user_model()

class AnalyticsOverviewApi(APIView):
    permission_classes = [IsAuthenticated, IsInternalAdmin]

    def get(self, request):
        users = User.objects.all()
        admin_count = users.filter(groups__name='admin').count()
        instructor_count = users.filter(groups__name='instructor').count()
        student_count = users.filter(groups__name='student').count()
        return Response({
            'users': {
                'total': users.count(),
                'admins': admin_count,
                'instructors': instructor_count,
                'students': student_count,
            },
            'courses': Course.objects.count(),
            'videos': Video.objects.count(),
        })

class AnalyticsByCourseApi(APIView):
    permission_classes = [IsAuthenticated, IsInternalAdmin]

    def get(self, request, course_id):
        course = Course.objects.get(id=course_id)
        student_count = course.users.filter(groups__name='student').count()
        progress = VideoProgress.objects.filter(course=course)
        avg_completion = progress.aggregate(avg=Avg('progress_percent'))['avg'] or 0
        watched_count = progress.filter(watched=True).count()
        total_videos = course.videos.count()

        quiz_attempts = QuizAttempt.objects.filter(quiz__course=course)
        avg_quiz_score = quiz_attempts.aggregate(avg=Avg('score'))['avg'] or 0

        return Response({
            'course_name': course.name,
            'student_count': student_count,
            'avg_completion': round(avg_completion, 1),
            'videos_watched': watched_count,
            'total_videos': total_videos,
            'avg_quiz_score': round(avg_quiz_score, 1),
            'total_quiz_attempts': quiz_attempts.count(),
        })
```

- [ ] **Step 2: Add analytics URLs**

In `backend/backend/urls.py`, add:

```python
from backend.analytics_apis import AnalyticsOverviewApi, AnalyticsByCourseApi

# Add to urlpatterns:
path('api/analytics/overview/', AnalyticsOverviewApi.as_view()),
path('api/analytics/course/<int:course_id>/', AnalyticsByCourseApi.as_view()),
```

- [ ] **Step 3: Commit**

```bash
git add backend/backend/analytics_apis.py backend/backend/urls.py
git commit -m "feat: add analytics API endpoints for overview and per-course stats"
```

---

### Task 24: Build Visibility Toggle & Student Management Endpoints

**Files:**
- Modify: `backend/institution/courses/apis.py`
- Modify: `backend/institution/courses/urls.py`

- [ ] **Step 1: Add visibility toggle to courses APIs**

In `backend/institution/courses/apis.py`, add:

```python
class CourseVisibilityApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, course_id):
        course = Course.objects.get(id=course_id)
        course.is_visible = not course.is_visible
        course.save()
        return Response({'is_visible': course.is_visible})

class CourseStudentsApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        course = Course.objects.get(id=course_id)
        students = course.users.filter(groups__name='student')
        data = []
        for student in students:
            progress = VideoProgress.objects.filter(user=student, course=course)
            total = course.videos.count()
            watched = progress.filter(watched=True).count()
            data.append({
                'id': student.id,
                'email': student.email,
                'first_name': student.first_name,
                'last_name': student.last_name,
                'videos_watched': watched,
                'total_videos': total,
                'progress_percent': round((watched / total * 100) if total > 0 else 0, 1),
            })
        return Response(data)

    def post(self, request, course_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        course = Course.objects.get(id=course_id)
        user = User.objects.get(id=request.data['user_id'])
        course.users.add(user)
        return Response({'status': 'added'}, status=201)

class CourseStudentByIdApi(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, course_id, user_id):
        course = Course.objects.get(id=course_id)
        course.users.remove(user_id)
        return Response(status=204)
```

Add necessary imports at the top of the file: `VideoProgress` from `video.models`, `Course` from `institution.models`.

- [ ] **Step 2: Add subject visibility toggle**

In `backend/institution/subjects/apis.py`, add a `SubjectVisibilityApi`:

```python
class SubjectVisibilityApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, subject_id):
        subject = Subject.objects.get(id=subject_id)
        subject.is_visible = not subject.is_visible
        subject.save()
        return Response({'is_visible': subject.is_visible})
```

- [ ] **Step 3: Add URLs for new endpoints**

In `backend/institution/courses/urls.py`, add:
```python
path('<int:course_id>/visibility/', CourseVisibilityApi.as_view()),
path('<int:course_id>/students/', CourseStudentsApi.as_view()),
path('<int:course_id>/students/<int:user_id>/', CourseStudentByIdApi.as_view()),
```

In `backend/institution/subjects/urls.py`, add:
```python
path('<int:subject_id>/visibility/', SubjectVisibilityApi.as_view()),
```

- [ ] **Step 4: Update existing list endpoints to filter by is_visible for students**

In `backend/institution/apis.py`, update course and subject list views to check user role and filter `is_visible=True` for students.

- [ ] **Step 5: Commit**

```bash
git add backend/institution/
git commit -m "feat: add visibility toggles, student management, and role-based filtering"
```

---

### Task 24b: Add Video Reorder Endpoint

**Files:**
- Modify: `backend/institution/subjects/apis.py`
- Modify: `backend/institution/subjects/urls.py`

- [ ] **Step 1: Add SubjectVideoOrderApi**

In `backend/institution/subjects/apis.py`, add:

```python
class SubjectVideoOrderApi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, subject_id):
        subject = Subject.objects.get(id=subject_id)
        video_ids = request.data.get('video_ids', [])
        # Clear and re-add in order — M2M through table preserves insertion order
        subject.videos.clear()
        for video_id in video_ids:
            subject.videos.add(video_id)
        return Response({'status': 'reordered', 'video_ids': video_ids})
```

Add necessary imports: `APIView`, `Response`, `IsAuthenticated`, `Subject` from `institution.models`.

- [ ] **Step 2: Add URL**

In `backend/institution/subjects/urls.py`, add:

```python
from institution.subjects.apis import SubjectVideoOrderApi

path('<int:subject_id>/videos/order/', SubjectVideoOrderApi.as_view()),
```

- [ ] **Step 3: Commit**

```bash
git add backend/institution/subjects/apis.py backend/institution/subjects/urls.py
git commit -m "feat: add video reorder endpoint for subjects"
```

---

### Task 25: Update Video Serializer for Thumbnails

**Files:**
- Modify: `backend/video/serializers.py`
- Modify: `backend/video/apis.py`

- [ ] **Step 1: Update VideoGetSchema to include thumbnail and duration**

`VideoGetSchema` is a plain `serializers.Serializer` (NOT a ModelSerializer), so it has no `Meta.fields`. Add these as explicit fields:

```python
# Add these fields to VideoGetSchema class:
duration_seconds = serializers.IntegerField(allow_null=True, required=False)
thumbnail_url = serializers.SerializerMethodField()

def get_thumbnail_url(self, obj):
    if obj.thumbnail:
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return obj.thumbnail.url
    return None
```

- [ ] **Step 2: Pass request context to serializer in all views**

In `backend/video/apis.py`, update all `VideoGetSchema(...)` calls to include request context:

```python
# Change from:
VideoGetSchema(video)
VideoGetSchema(videos, many=True)

# To:
VideoGetSchema(video, context={'request': request})
VideoGetSchema(videos, many=True, context={'request': request})
```

- [ ] **Step 3: Commit**

```bash
git add backend/video/serializers.py backend/video/apis.py
git commit -m "feat: add thumbnail URL and duration to video serializer"
```

---

## Chunk 6: Frontend — Student Dashboard & VR Player

### Task 26: Build Student Dashboard Page

**Files:**
- Create: `frontend/pages/dashboard/student/index.tsx`
- Create: `frontend/components/student/EnrollModal.tsx`

Full implementation code for these files is in `docs/superpowers/plans/chunk6-code.md` (Tasks 26-28c). The key patterns:

- [ ] **Step 1: Create EnrollModal component**

Create `frontend/components/student/EnrollModal.tsx` — a Dialog component with course name + password fields, calls `apiPost("/api/institutions/add_course/", { course_name, course_password })`. Uses GlassCard dialog styling.

- [ ] **Step 2: Create student dashboard page**

Create `frontend/pages/dashboard/student/index.tsx`:
- Wrap with `withAuth(StudentDashboard, ["student"])` at bottom
- State: `courses` (from `/api/institutions/courses/`), `recent` (from `/api/video/progress/recent/`), `progressMap` (per-course from `/api/video/progress/course/{id}/`)
- Layout: PageContainer with welcome header (user.first_name), StatBadge row, Grid with 8-col My Courses (GlassCards with LinearProgress bars, onClick navigates to `/dashboard/student/course/{id}`), 4-col Recent Activity (GlassCard list), EnrollModal toggled by GradientButton
- getCourseProgress helper: counts watched items / total items from progressMap

- [ ] **Step 3: Verify student dashboard renders**

```bash
cd frontend && npm run dev
```

Login as `student1@example.com` / `password`. Expected: Student dashboard with courses grid.

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/dashboard/student/index.tsx frontend/components/student/EnrollModal.tsx
git commit -m "feat: add student dashboard with courses grid, progress, and quick enroll"
```

---

### Task 27: Build Student Course View Page

**Files:**
- Create: `frontend/pages/dashboard/student/course/[courseId].tsx`

Full implementation code in `docs/superpowers/plans/chunk6-code.md`.

- [ ] **Step 1: Create student course view**

Create `frontend/pages/dashboard/student/course/[courseId].tsx`:
- Wrap with `withAuth(StudentCourseView, ["student"])` at bottom
- State: `course` (from `/api/courses/{courseId}`), `progress` (from `/api/video/progress/course/{courseId}/`), `announcements` (from `/api/institutions/course/{courseId}/announcements`), `tab` (0/1/2)
- Tabs component with 3 tabs: Content, Announcements, My Progress
- Content tab: map `course.subjects` into Accordion components, each containing VideoCard subcomponents. VideoCard shows CheckCircleIcon (green) if watched, PlayCircleIcon (blue) if not. onClick navigates to `/dashboard/student/watch/{videoId}?course={courseId}&subject={subjectId}`. Also show "Other Content" section for course-level videos.
- Announcements tab: sort by pinned first, then by date desc. GlassCards with title, body, date, Chip for "Pinned".
- My Progress tab: GlassCard with overall LinearProgress bar, then list of all videos with completion status.
- Helper functions: `isWatched(videoId)`, `getPercent(videoId)` reading from progress array.

- [ ] **Step 2: Verify course view renders**

Navigate to `/dashboard/student/course/1`. Expected: Tabbed course view with content, announcements, progress.

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/dashboard/student/course/
git commit -m "feat: add student course view with tabs for content, announcements, progress"
```

---

### Task 28: Build A-Frame VR Video Player Component

**Files:**
- Create: `frontend/components/player/VRPlayer.tsx`

Full implementation code in `docs/superpowers/plans/chunk6-code.md`.

- [ ] **Step 1: Create VRPlayer component**

Create `frontend/components/player/VRPlayer.tsx`:
- Props: `videoSrc` (string), `onTimeUpdate` (callback with seconds), `onProgress` (callback with percent), `seekTo` (number or null)
- Load A-Frame via script tag in useEffect (client-side only, avoids Next.js SSR issues)
- Hidden `<video>` element with ref, used as source for A-Frame `<a-videosphere>`
- Build A-Frame scene using safe DOM APIs (document.createElement): create `<a-scene>` (embedded, vr-mode-ui disabled), append `<a-videosphere>` (src pointing to video element id), append `<a-camera>` (wasd disabled)
- Controls overlay: Box with IconButton (play/pause toggle), Slider for seek
- useEffect for seekTo: when seekTo changes, set video.currentTime
- handleTimeUpdate: fires onTimeUpdate with Math.floor(currentTime), fires onProgress with (currentTime/duration)*100

- [ ] **Step 2: Commit**

```bash
git add frontend/components/player/VRPlayer.tsx
git commit -m "feat: add A-Frame 360 VR video player component"
```

---

### Task 28b: Build Chapter Markers & Video Notes Components

**Files:**
- Create: `frontend/components/player/ChapterMarkers.tsx`
- Create: `frontend/components/player/VideoNotes.tsx`

Full implementation code in `docs/superpowers/plans/chunk6-code.md`.

- [ ] **Step 1: Create ChapterMarkers component**

Create `frontend/components/player/ChapterMarkers.tsx`:
- Props: `videoId` (number), `currentTime` (number), `onSeek` (callback with seconds)
- Fetch markers from `apiGet("/api/video/{videoId}/chapters/")` on mount
- Render horizontal Stack of Chips: `{formatTime(timestamp)} - {label}`
- Highlight active chapter (last marker where timestamp_seconds <= currentTime)
- onClick calls onSeek(timestamp_seconds)
- formatTime helper: `Math.floor(s/60):${(s%60).toString().padStart(2,"0")}`

- [ ] **Step 2: Create VideoNotes component**

Create `frontend/components/player/VideoNotes.tsx`:
- Props: `videoId` (number), `currentTime` (number), `onSeek` (callback with seconds)
- Fetch notes from `apiGet("/api/video/{videoId}/notes/")`, refetch after add/delete
- GlassCard with title "My Notes", scrollable list of notes (timestamp button + text + delete IconButton)
- Add form at bottom: timestamp caption (formatTime of currentTime), TextField, "Add" button
- POST via `apiPost("/api/video/{videoId}/notes/", { timestamp_seconds: currentTime, text })`
- DELETE via `apiDelete("/api/video/{videoId}/notes/{noteId}/")`

- [ ] **Step 3: Commit**

```bash
git add frontend/components/player/ChapterMarkers.tsx frontend/components/player/VideoNotes.tsx
git commit -m "feat: add chapter markers and video notes components"
```

---

### Task 28c: Build Watch Video Page

**Files:**
- Create: `frontend/pages/dashboard/student/watch/[videoId].tsx`

Full implementation code in `docs/superpowers/plans/chunk6-code.md`.

- [ ] **Step 1: Create watch page**

Create `frontend/pages/dashboard/student/watch/[videoId].tsx`:
- Wrap with `withAuth(WatchVideoPage, ["student"])` at bottom
- Read `videoId` from router.query, `course` and `subject` from query params
- State: `video` (from `/api/video/{videoId}/`), `currentTime`, `seekTo`, `markedComplete`, `maxProgress`
- Layout: PageContainer (maxWidth xl), Breadcrumbs (Dashboard > Course > VideoTitle), VRPlayer (full width), ChapterMarkers below player, Grid with 7-col (title, description, Mark Complete button) and 5-col (VideoNotes)
- handleProgress: track maxProgress, auto-mark complete at 80% via `apiPost("/api/video/progress/", { video, course, progress_percent, watched: true })`
- handleMarkComplete: manually post 100% progress
- handleSeek: set seekTo state, clear after 100ms timeout
- videoSrc: `${process.env.API_URL}/${video.video}`

- [ ] **Step 2: Verify watch page renders**

Navigate to `/dashboard/student/watch/1?course=1&subject=1`. Expected: Full VR player with chapter markers, notes panel, and mark complete.

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/dashboard/student/watch/
git commit -m "feat: add VR video watch page with chapters, notes, and progress tracking"
```

---

## Chunk 7: Frontend — Instructor & Admin Dashboard Polish

### Task 29a: Restyle Instructor Dashboard Layout

**Files:**
- Modify: `frontend/pages/dashboard/instructor/index.tsx`
- Modify: `frontend/components/SelectedCourse.tsx`
- Modify: `frontend/components/instructor/General.tsx`

- [ ] **Step 1: Read existing files**

Read `frontend/pages/dashboard/instructor/index.tsx`, `frontend/components/SelectedCourse.tsx`, `frontend/components/instructor/General.tsx`.

- [ ] **Step 2: Restyle instructor dashboard page**

Update `frontend/pages/dashboard/instructor/index.tsx`:
- Add `import { withAuth } from "@/lib/auth"` and wrap export: `export default withAuth(InstructorDashboard, ["instructor"])`
- Replace the Drawer component's `sx` with dark theme: `background: "rgba(21, 27, 46, 0.95)"`, border: `"1px solid rgba(59, 130, 246, 0.1)"`
- Replace the main content area background: remove any white/light backgrounds
- Apply gradient to the page title
- Keep existing sidebar + SelectedCourse functional structure — only change colors/styling

- [ ] **Step 3: Restyle SelectedCourse tabs**

Update `frontend/components/SelectedCourse.tsx`:
- Tabs: `"& .MuiTab-root": { color: "#94a3b8" }, "& .Mui-selected": { color: "#3b82f6" }`
- Keep the General/Announcements/Content toggle logic, just restyle

- [ ] **Step 4: Implement General component**

Update `frontend/components/instructor/General.tsx`:
- Replace the `// TODO: Add functionality` with a working "Upload Video" button that navigates to `/video/uploadvideo`
- Style with dark theme

- [ ] **Step 5: Commit**

```bash
git add frontend/pages/dashboard/instructor/index.tsx frontend/components/SelectedCourse.tsx frontend/components/instructor/General.tsx
git commit -m "feat: restyle instructor dashboard layout with dark theme"
```

---

### Task 29b: Restyle Instructor Content Components

**Files:**
- Modify: `frontend/components/course_content/CourseContent.tsx`
- Modify: `frontend/components/course_content/SubjectContent.tsx`
- Modify: `frontend/components/course_content/VideoContent.tsx`
- Modify: `frontend/components/course_content/VideoSelector.tsx`

- [ ] **Step 1: Read existing files**

Read all four files to understand current structure.

- [ ] **Step 2: Restyle CourseContent and SubjectContent**

Apply dark theme to accordion components:
- Accordion: `background: "rgba(21, 27, 46, 0.6)"`, `backdropFilter: "blur(20px)"`, `border: "1px solid rgba(59, 130, 246, 0.1)"`
- ExpandMore icon: `color: "#94a3b8"`
- Text colors: primary headings white, secondary text `#94a3b8`

- [ ] **Step 3: Restyle VideoContent**

Apply GlassCard styling to video cards, show thumbnail if available, add "Manage Chapters" button (for Task 30).

- [ ] **Step 4: Restyle VideoSelector**

Dialog: `PaperProps.sx: { background: "rgba(21, 27, 46, 0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(59, 130, 246, 0.1)" }`

- [ ] **Step 5: Commit**

```bash
git add frontend/components/course_content/
git commit -m "feat: restyle course content components with dark theme"
```

---

### Task 29c: Restyle Instructor Announcement Components

**Files:**
- Modify: `frontend/components/announcements/AnnouncementsList.tsx`
- Modify: `frontend/components/announcements/CreateAnnouncements.tsx`
- Modify: `frontend/components/announcements/EditAnnouncement.tsx`

- [ ] **Step 1: Read existing files**

Read all three announcement files.

- [ ] **Step 2: Restyle AnnouncementsList**

Apply GlassCard styling to each announcement card. Sort pinned announcements to top (pinned=true first, then by date desc). Show Chip label "Pinned" on pinned items.

- [ ] **Step 3: Restyle Create and Edit forms**

Apply dark theme to form fields and buttons. Use GradientButton for submit.

- [ ] **Step 4: Commit**

```bash
git add frontend/components/announcements/
git commit -m "feat: restyle announcement components with dark theme and pinned support"
```

---

### Task 30: Add Chapter Marker Editor to Instructor Dashboard

**Files:**
- Create: `frontend/components/instructor/ChapterMarkerEditor.tsx`

- [ ] **Step 1: Create chapter marker editor component**

Create `frontend/components/instructor/ChapterMarkerEditor.tsx`:

This component should:
- Accept `videoId` prop
- Fetch existing markers from `/api/video/{videoId}/chapters/`
- Display list of markers (timestamp + label) with delete buttons
- "Add Marker" form: timestamp input (minutes:seconds), label text field
- POST to `/api/video/{videoId}/chapters/`
- Inline in the video content view when an instructor clicks on a video

- [ ] **Step 2: Integrate into VideoContent component**

Add a "Manage Chapters" button to `VideoContent.tsx` that opens the ChapterMarkerEditor.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/instructor/ChapterMarkerEditor.tsx frontend/components/course_content/VideoContent.tsx
git commit -m "feat: add chapter marker editor for instructors"
```

---

### Task 31: Add Quiz Builder to Instructor Dashboard

**Files:**
- Create: `frontend/components/instructor/QuizBuilder.tsx`
- Create: `frontend/components/instructor/QuestionEditor.tsx`

- [ ] **Step 1: Create QuizBuilder component**

Create `frontend/components/instructor/QuizBuilder.tsx`:

This component should:
- Accept `courseId` prop
- Fetch quizzes from `/api/quizzes/?course_id={courseId}`
- List existing quizzes with question count and "Edit" button
- "Create Quiz" form: title, optional video/subject selection
- POST to `/api/quizzes/`

- [ ] **Step 2: Create QuestionEditor component**

Create `frontend/components/instructor/QuestionEditor.tsx`:

This component should:
- Accept `quizId` prop
- Fetch questions from `/api/quizzes/{quizId}/questions/`
- Display questions with choices
- Add question form: text + multiple choice options (mark correct answer)
- POST to `/api/quizzes/{quizId}/questions/` with choices array
- Delete question button

- [ ] **Step 3: Integrate quiz builder into instructor course content**

Add a "Quizzes" tab or section in the instructor course view.

- [ ] **Step 4: Commit**

```bash
git add frontend/components/instructor/QuizBuilder.tsx frontend/components/instructor/QuestionEditor.tsx
git commit -m "feat: add quiz builder and question editor for instructors"
```

---

### Task 32a: Restyle Admin Dashboard Main Page

**Files:**
- Modify: `frontend/pages/dashboard/admin/index.tsx`

- [ ] **Step 1: Read existing admin dashboard**

Read `frontend/pages/dashboard/admin/index.tsx`.

- [ ] **Step 2: Restyle admin dashboard**

Update `frontend/pages/dashboard/admin/index.tsx`:
- Add `import { withAuth } from "@/lib/auth"` and wrap: `export default withAuth(AdminDashboard, ["admin"])`
- Replace with PageContainer, SectionHeader with gradient
- Navigation as a Grid of GlassCards with glow: Institutions (`/institutions`), Users (`/users/delete`), Invite Admin (`/users/invite/admin`), Invite Instructor (`/users/invite/instructor`), Analytics (`/dashboard/admin/analytics`), Student Management (`/dashboard/admin/students`)
- Each card has an icon (AccountBalance, People, PersonAdd, BarChart, etc.), title, and short description

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/dashboard/admin/index.tsx
git commit -m "feat: restyle admin dashboard with dark theme navigation cards"
```

---

### Task 32b: Restyle Institution Management Pages

**Files:**
- Modify: `frontend/pages/institutions/index.tsx`
- Modify: `frontend/pages/institutions/create.tsx`
- Modify: `frontend/pages/institutions/[id].tsx`
- Modify: `frontend/pages/institutions/[id]/program/[programId].tsx`
- Modify: `frontend/pages/institutions/[id]/program/[programId]/course/[courseId].tsx`
- Modify: `frontend/pages/institutions/[id]/program/[programId]/course/[courseId]/subject/[subjectId].tsx`

- [ ] **Step 1: Read all institution pages**

Read each file to understand current structure and API calls.

- [ ] **Step 2: Apply dark theme to all institution pages**

For each page, apply consistent styling:
- Wrap with `withAuth(Component, ["admin"])` HOC
- Use PageContainer, SectionHeader (gradient), GlassCard for list items
- Add Breadcrumb navigation at top: Institutions > {name} > Programs > {name} > Courses > {name}
- Keep all existing functionality (create, delete, etc.) — just restyle
- On course detail page: add visibility toggle (call `apiPatch("/api/courses/{id}/visibility/")`)
- On subject detail page: add visibility toggle (call `apiPatch("/api/subjects/{id}/visibility/")`)

- [ ] **Step 3: Verify navigation flow**

Login as admin, navigate: Institutions > select one > program > course > subject. Expected: Dark theme with breadcrumbs throughout.

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/institutions/
git commit -m "feat: restyle institution management pages with dark theme and visibility toggles"
```

---

### Task 32c: Restyle User Management & Video Upload Pages

**Files:**
- Modify: `frontend/pages/users/delete.tsx`
- Modify: `frontend/pages/users/invite/admin.tsx`
- Modify: `frontend/pages/users/invite/instructor.tsx`
- Modify: `frontend/pages/users/course/instructor.tsx`
- Modify: `frontend/pages/video/uploadvideo.tsx`

- [ ] **Step 1: Read all user and video pages**

Read each file.

- [ ] **Step 2: Restyle user management pages**

For each page:
- Wrap with `withAuth(Component, ["admin"])` (or `["admin", "instructor"]` for invite pages)
- Use PageContainer, GlassCard forms, GradientButton for actions
- Dark themed TextFields, Select components

- [ ] **Step 3: Restyle video upload page**

- Wrap with `withAuth(Component, ["instructor", "admin"])`
- GlassCard form with dark theme
- GradientButton for upload

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/users/ frontend/pages/video/
git commit -m "feat: restyle user management and video upload pages with dark theme"
```

---

### Task 33: Build Admin Analytics Page

**Files:**
- Create: `frontend/pages/dashboard/admin/analytics.tsx`

- [ ] **Step 1: Create analytics page**

Create `frontend/pages/dashboard/admin/analytics.tsx`:

This page should:
- Use `withAuth(Component, ['admin'])` HOC
- Fetch overview from `/api/analytics/overview/`
- Fetch per-course stats for each course
- Display: StatBadge row for totals (users, courses, videos)
- Bar chart (Recharts): students per course
- Donut chart (Recharts): users by role
- Per-course cards with progress stats and quiz scores
- All with dark theme, GlassCards

- [ ] **Step 2: Verify analytics page**

Login as admin, navigate to analytics. Expected: Charts and stats with dark theme.

- [ ] **Step 3: Commit**

```bash
git add frontend/pages/dashboard/admin/analytics.tsx
git commit -m "feat: add admin analytics page with charts and course stats"
```

---

### Task 34: Build Admin Student Management

**Files:**
- Create: `frontend/pages/dashboard/admin/students.tsx`

- [ ] **Step 1: Create student management page**

Create `frontend/pages/dashboard/admin/students.tsx`:

This page should:
- Use `withAuth(Component, ['admin'])` HOC
- Course selector dropdown
- Fetch students from `/api/courses/{courseId}/students/`
- Display searchable table: name, email, videos watched, progress %
- Add student button (enter email, POST to `/api/courses/{courseId}/students/`)
- Remove student button (DELETE)
- Bulk remove checkbox selection

- [ ] **Step 2: Commit**

```bash
git add frontend/pages/dashboard/admin/students.tsx
git commit -m "feat: add admin student management page with progress tracking"
```

---

## Chunk 8: Student Quiz Taking & Final Polish

### Task 35: Build Student Quiz Taking Page

**Files:**
- Create: `frontend/pages/dashboard/student/quiz/[quizId].tsx`

- [ ] **Step 1: Create quiz taking page**

Create `frontend/pages/dashboard/student/quiz/[quizId].tsx`:

This page should:
- Use `withAuth(Component, ['student'])` HOC
- Fetch quiz with questions from `/api/quizzes/{quizId}/`
- Display one question at a time with radio button choices
- Navigation: Previous / Next / Submit
- On submit: POST answers to `/api/quizzes/{quizId}/attempt/`
- Results view: show score, correct/incorrect per question
- Dark theme with GlassCards per question

- [ ] **Step 2: Add quiz links to student course view**

In the student course view page, add quiz cards/buttons that link to the quiz page for each available quiz in the course.

- [ ] **Step 3: Verify quiz flow**

Navigate through: student dashboard → course → take quiz → see results.

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/dashboard/student/quiz/ frontend/pages/dashboard/student/course/
git commit -m "feat: add student quiz taking page with results view"
```

---

### Task 36: Update Seed Script with Rich Demo Data

**Files:**
- Modify: `backend/backend/management/commands/seed_db.py`

- [ ] **Step 1: Enhance seed_db command**

Update the seed script to also create:
- Sample `VideoProgress` records (some videos watched, varying percentages)
- Sample `ChapterMarker` records on existing videos
- Sample `VideoNote` records for students
- Sample `Quiz` with `Question`/`Choice` entries per course
- Sample `QuizAttempt`/`QuizAnswer` records for students
- Set `is_visible` on some courses/subjects to demonstrate the toggle

This makes the demo look populated and realistic.

- [ ] **Step 2: Reset and re-seed**

```bash
cd backend && source venv/Scripts/activate && python manage.py reset_db
```

- [ ] **Step 3: Verify seeded data appears in dashboard**

Login as each role. Expected: Populated dashboards with realistic data.

- [ ] **Step 4: Commit**

```bash
git add backend/backend/management/commands/seed_db.py
git commit -m "feat: enhance seed script with progress, quizzes, chapters, notes demo data"
```

---

### Task 37: Remove Old Test Page & VideoViewer

**Files:**
- Delete: `frontend/pages/test.tsx`
- Delete: `frontend/components/VideoViewer.tsx`

- [ ] **Step 1: Remove deprecated files**

Delete `frontend/pages/test.tsx` and `frontend/components/VideoViewer.tsx` (the old react-vr-player component).

- [ ] **Step 2: Commit**

```bash
git rm frontend/pages/test.tsx frontend/components/VideoViewer.tsx
git commit -m "chore: remove deprecated test page and old VideoViewer component"
```

---

### Task 38: Final Polish & README

**Files:**
- Modify: `frontend/components/NavBar.tsx` — make context-aware (auth state)
- Modify: `README.md`

- [ ] **Step 1: Make NavBar context-aware**

NavBar was already moved to `_app.tsx` in Task 4. Now update `frontend/components/NavBar.tsx` to show:
- Unauthenticated: "Log In" + "Sign Up" (current behavior)
- Authenticated: Dashboard link + user name + "Log Out" button

Add a useEffect that calls `apiGet("/api/auth/user")`. If successful, show authenticated nav. On "Log Out" click, call `apiPost("/api/auth/logout/")` and redirect to `/`.

- [ ] **Step 2: Rewrite README**

Replace `README.md` with a polished version:
- Project name and one-line description
- Screenshot placeholder (or actual screenshots)
- Features list (all implemented features)
- Tech stack with badges
- Getting started (quick setup with setup.sh)
- Demo accounts table
- Architecture overview
- Contributing section

- [ ] **Step 3: Final verification**

Start both servers. Walk through every flow:
1. Landing page loads with full scroll
2. Student registration → dashboard → course → watch VR video → notes → quiz
3. Instructor login → course management → upload video → chapter markers → quiz builder
4. Admin login → institutions → analytics → student management → visibility toggles

- [ ] **Step 4: Commit**

```bash
git add frontend/pages/_document.tsx frontend/pages/_app.tsx frontend/components/NavBar.tsx README.md
git commit -m "feat: final polish — context-aware nav, README rewrite"
```
