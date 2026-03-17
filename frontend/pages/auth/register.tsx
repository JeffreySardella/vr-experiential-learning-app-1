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
