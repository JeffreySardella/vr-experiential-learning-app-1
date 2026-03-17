import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box, Typography, TextField, Breadcrumbs } from "@mui/material";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

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

const CreateInstitution = ({ user }: { user: any }) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/institutions/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        router.push("/institutions");
      } else {
        console.error(
          `Failed to create institution. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Breadcrumbs sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "#94a3b8" } }}>
        <Link href="/dashboard/admin" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link href="/institutions" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Institutions
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>Create</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <GlassCard sx={{ p: 4, maxWidth: 500, width: "100%" }}>
          <SectionHeader title="Create New Institution" gradient align="center" />

          <TextField
            fullWidth
            label="Institution Name"
            value={name}
            onChange={handleNameChange}
            sx={{ ...darkTextFieldSx, mb: 3 }}
          />

          <GradientButton fullWidth onClick={handleCreate}>
            Create
          </GradientButton>
        </GlassCard>
      </Box>
    </PageContainer>
  );
};

export default withAuth(CreateInstitution, ["admin"]);
