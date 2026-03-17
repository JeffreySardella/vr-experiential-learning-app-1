import { Grid, Typography, CardContent, Box } from "@mui/material";
import { useRouter } from "next/router";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";

const cards = [
  {
    title: "Institutions",
    description: "Manage institutions, programs, and courses",
    icon: BusinessIcon,
    href: "/institutions",
    color: "#3b82f6",
  },
  {
    title: "Delete Users",
    description: "Remove user accounts from the system",
    icon: PeopleIcon,
    href: "/users/delete",
    color: "#ef4444",
  },
  {
    title: "Invite Admin",
    description: "Invite new administrators to the platform",
    icon: AdminPanelSettingsIcon,
    href: "/users/invite/admin",
    color: "#8b5cf6",
  },
  {
    title: "Invite Instructor",
    description: "Invite instructors and manage course access",
    icon: SchoolIcon,
    href: "/users/course/instructor",
    color: "#06b6d4",
  },
  {
    title: "Analytics",
    description: "View platform analytics and statistics",
    icon: BarChartIcon,
    href: "/dashboard/admin/analytics",
    color: "#22c55e",
  },
  {
    title: "Student Management",
    description: "Manage students and course enrollments",
    icon: GroupsIcon,
    href: "/dashboard/admin/students",
    color: "#f59e0b",
  },
];

const Dashboard = ({ user }: { user: any }) => {
  const router = useRouter();

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <SectionHeader
        title="Admin Dashboard"
        subtitle={`Welcome back, ${user.first_name || "Admin"}`}
        gradient
      />

      <Grid container spacing={3}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <GlassCard
                glow
                sx={{ cursor: "pointer", height: "100%" }}
                onClick={() => router.push(card.href)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${card.color}20`,
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ color: card.color, fontSize: 28 }} />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
          );
        })}
      </Grid>
    </PageContainer>
  );
};

export default withAuth(Dashboard, ["admin"]);
