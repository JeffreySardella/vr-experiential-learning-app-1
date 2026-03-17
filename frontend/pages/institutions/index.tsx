import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Grid, Typography, CardContent, Box, Breadcrumbs } from "@mui/material";
import { Institution } from "./interfaces";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import BusinessIcon from "@mui/icons-material/Business";

const InstitutionList = ({ user }: { user: any }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/institutions/`
        );
        const data: Institution[] = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutions();
  }, []);

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Breadcrumbs sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { color: "#94a3b8" } }}>
        <Link href="/dashboard/admin" style={{ color: "#3b82f6", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Typography sx={{ color: "#f1f5f9" }}>Institutions</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <SectionHeader title="Institutions" gradient />
        <GradientButton onClick={() => router.push("/institutions/create")}>
          Create Institution
        </GradientButton>
      </Box>

      <Grid container spacing={3}>
        {institutions.map((institution) => (
          <Grid item xs={12} sm={6} md={4} key={institution.id}>
            <GlassCard
              glow
              sx={{ cursor: "pointer" }}
              onClick={() => router.push(`/institutions/${institution.id}`)}
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
                    background: "rgba(59, 130, 246, 0.15)",
                    mb: 2,
                  }}
                >
                  <BusinessIcon sx={{ color: "#3b82f6" }} />
                </Box>
                <Typography variant="h6" sx={{ color: "#f1f5f9", fontWeight: 600 }}>
                  {institution.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                  Created: {new Date(institution.datetime_created).toLocaleDateString()}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        ))}
      </Grid>

      {institutions.length === 0 && (
        <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
          No institutions found. Create one to get started.
        </Typography>
      )}
    </PageContainer>
  );
};

export default withAuth(InstitutionList, ["admin"]);
