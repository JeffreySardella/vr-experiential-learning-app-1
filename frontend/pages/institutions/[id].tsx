import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Institution, Program } from "./interfaces";
import {
  Box,
  Typography,
  TextField,
  Grid,
  CardContent,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import FolderIcon from "@mui/icons-material/Folder";

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    "& fieldset": { borderColor: "rgba(59, 130, 246, 0.2)" },
    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

const InstitutionDetailPage = ({ user }: { user: any }) => {
  const router = useRouter();
  const { id } = router.query;
  const [institution, setInstitution] = useState<Institution>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      fetchPrograms();
      setName("");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstitution = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}`
      );
      const data: Institution = await response.json();
      setInstitution(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/`
      );
      const data: Program[] = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInstitution();
      fetchPrograms();
    }
  }, [id]);

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Breadcrumbs sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "#94a3b8" } }}>
        <Link href="/dashboard/admin" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link href="/institutions" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Institutions
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>{institution?.name}</Typography>
      </Breadcrumbs>

      <SectionHeader
        title={`Institution: ${institution?.name || ""}`}
        gradient
      />

      <Typography
        variant="h6"
        sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2, mt: 2 }}
      >
        Programs
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {programs.map((program) => (
          <Grid item xs={12} sm={6} md={4} key={program.id}>
            <GlassCard
              glow
              sx={{ cursor: "pointer" }}
              onClick={() =>
                router.push(`/institutions/${id}/program/${program.id}`)
              }
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(6, 182, 212, 0.15)",
                    mb: 2,
                  }}
                >
                  <FolderIcon sx={{ color: "#06b6d4" }} />
                </Box>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {program.name}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      <GlassCard sx={{ p: 3, maxWidth: 500 }}>
        <Typography
          variant="subtitle1"
          sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
        >
          Add Program
        </Typography>
        <form onSubmit={handleCreate}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="Program Name"
              size="small"
              value={name}
              onChange={handleNameChange}
              sx={{ ...darkTextFieldSx, flexGrow: 1 }}
            />
            <GradientButton type="submit">Create</GradientButton>
          </Stack>
        </form>
      </GlassCard>
    </PageContainer>
  );
};

export default withAuth(InstitutionDetailPage, ["admin"]);
