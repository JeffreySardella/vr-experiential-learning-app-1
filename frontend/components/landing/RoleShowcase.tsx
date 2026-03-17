import { Box, Grid, Typography, CardContent } from "@mui/material";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const roles = [
  { icon: <PersonIcon sx={{ fontSize: 36, color: "#3b82f6" }} />, title: "Students", items: ["Enroll in courses", "Watch 360° VR videos", "Take notes & quizzes", "Track progress"] },
  { icon: <MenuBookIcon sx={{ fontSize: 36, color: "#06b6d4" }} />, title: "Instructors", items: ["Upload VR content", "Organize by subject", "Create quizzes", "Post announcements"] },
  { icon: <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#8b5cf6" }} />, title: "Administrators", items: ["Manage institutions", "Invite users", "View analytics", "Control access"] },
];

export default function RoleShowcase() {
  return (
    <Box sx={{ py: 12, px: 3 }}>
      <SectionHeader title="Built for Every Role" subtitle="Each user gets a tailored experience" align="center" gradient />
      <Grid container spacing={3} maxWidth="lg" sx={{ mx: "auto" }}>
        {roles.map((role) => (
          <Grid item xs={12} md={4} key={role.title}>
            <GlassCard glow sx={{ height: "100%" }}>
              <CardContent sx={{ py: 4, px: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                  {role.icon}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{role.title}</Typography>
                </Box>
                {role.items.map((item) => (
                  <Typography key={item} variant="body2" color="text.secondary" sx={{ py: 0.5, pl: 2, borderLeft: "2px solid rgba(59, 130, 246, 0.3)" }}>
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
