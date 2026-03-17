import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { Box, TextField, Typography, Alert } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { apiPost } from "@/lib/api";
import { login } from "@/links/links";

export default function AdminSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost("/api/auth/register/admins/", {
        new_password1: password,
        new_password2: passwordConfirmation,
        uid,
        token,
        email,
        first_name: firstname,
        last_name: lastname,
      });

      if (res.status === 204 || res.ok) {
        router.replace(login);
        return;
      }

      const json = await res.json();
      const errors: string[] = [];
      for (const item in json) {
        if (typeof json[item] === "string") {
          errors.push(json[item]);
        } else {
          for (const message of json[item]) {
            errors.push(`${item}: ${message}`);
          }
        }
      }
      setError(errors.join(" "));
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
      <GlassCard sx={{ position: "relative", zIndex: 1, p: 5, maxWidth: 460, width: "100%" }}>
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
          Admin Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          You&apos;ve been invited to join as an Admin
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email Address"
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
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <GradientButton type="submit" fullWidth disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </GradientButton>
        </form>
      </GlassCard>
    </Box>
  );
}
