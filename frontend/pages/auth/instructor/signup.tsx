import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import {
  Box, TextField, Typography, Alert, FormControl, InputLabel,
  Select, MenuItem, OutlinedInput, Chip, Stack
} from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import AuroraBackground from "@/components/landing/AuroraBackground";
import { apiGet, apiPost } from "@/lib/api";
import { login } from "@/links/links";
import { Program } from "@/pages/institutions/interfaces";

export default function InstructorSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const institution_id = searchParams.get("institution_id");
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [programIds, setProgramIds] = useState<string[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!institution_id) return;

    const fetchPrograms = async () => {
      try {
        const res = await apiGet(`/api/institutions/${institution_id}/programs/`);
        if (res.ok) {
          const data: Program[] = await res.json();
          setPrograms(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPrograms();
  }, [institution_id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost("/api/auth/register/instructors/", {
        email,
        new_password1: password,
        new_password2: passwordConfirmation,
        uid,
        token,
        first_name: firstname,
        last_name: lastname,
        program_ids:
          typeof programIds === "string"
            ? parseInt(programIds)
            : programIds.map((p) => parseInt(p)),
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
          Instructor Sign Up
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          You&apos;ve been invited to join as an Instructor
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
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Program(s)</InputLabel>
            <Select
              required
              multiple
              value={programIds}
              onChange={(e) => setProgramIds(e.target.value as string[])}
              input={<OutlinedInput label="Select Program(s)" />}
              renderValue={(selected) => (
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {(selected as string[]).map((id) => (
                    <Chip
                      key={id}
                      label={programs.find((p) => p.id === parseInt(id))?.name}
                      size="small"
                    />
                  ))}
                </Stack>
              )}
            >
              {programs.map((p) => (
                <MenuItem key={p.id} value={String(p.id)}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <GradientButton type="submit" fullWidth disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </GradientButton>
        </form>
      </GlassCard>
    </Box>
  );
}
