import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { Box, TextField, Typography, Alert, Link as MuiLink } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { apiGet, apiPost } from "@/lib/api";
import { dashboardAdmin, dashboardInstructor, dashboardStudent, register } from "@/links/links";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    apiGet("/api/auth/user/").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        const groups = data.groups || [];
        const isAdmin = groups.some((g: { name: string }) => g.name === "admin");
        const isInstructor = groups.some((g: { name: string }) => g.name === "instructor");
        if (isAdmin) router.replace(dashboardAdmin);
        else if (isInstructor) router.replace(dashboardInstructor);
        else router.replace(dashboardStudent);
      }
    }).catch(() => {});
  }, [router]);

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
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  return (
    <Box sx={{ position: "relative", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
      <AuroraBackground />
      <GlassCard sx={{ position: "relative", zIndex: 1, p: 5, maxWidth: 420, width: "100%" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: "center", background: "linear-gradient(135deg, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          Sign in to your Academ-VR account
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }} />
          <GradientButton type="submit" fullWidth disabled={loading} sx={{ mb: 2 }}>
            {loading ? "Signing in..." : "Sign In"}
          </GradientButton>
        </form>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Link href={register} passHref legacyBehavior><MuiLink sx={{ color: "#3b82f6" }}>Sign Up</MuiLink></Link>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Received an invite?{" "}
            <Link href="/auth/admin/signup" passHref legacyBehavior><MuiLink sx={{ color: "#06b6d4" }}>Admin</MuiLink></Link>
            {" / "}
            <Link href="/auth/instructor/signup" passHref legacyBehavior><MuiLink sx={{ color: "#06b6d4" }}>Instructor</MuiLink></Link>
          </Typography>
        </Box>
      </GlassCard>
    </Box>
  );
}
