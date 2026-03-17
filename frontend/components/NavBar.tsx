import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from "@mui/material";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api";
import { login, register, root, dashboardAdmin, dashboardInstructor, dashboardStudent } from "@/links/links";

type Role = "admin" | "instructor" | "student";

interface UserData {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: { name: string }[];
}

function getUserRole(groups: { name: string }[]): Role | null {
  if (groups.some((g) => g.name === "admin")) return "admin";
  if (groups.some((g) => g.name === "instructor")) return "instructor";
  if (groups.some((g) => g.name === "student")) return "student";
  return null;
}

const roleDashboard: Record<Role, string> = {
  admin: dashboardAdmin,
  instructor: dashboardInstructor,
  student: dashboardStudent,
};

export default function NavBar() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiGet("/api/auth/user");
        if (res.ok) {
          const data: UserData = await res.json();
          setUser(data);
        }
      } catch {
        // Not authenticated — ignore
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await apiPost("/api/auth/logout/");
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    router.push("/");
  };

  const role = user ? getUserRole(user.groups) : null;
  const dashboardLink = role ? roleDashboard[role] : null;

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
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#3b82f6" }} />
          ) : user ? (
            <>
              {dashboardLink && (
                <Link href={dashboardLink} style={{ textDecoration: "none" }}>
                  <Button variant="text" sx={{ color: "#94a3b8", "&:hover": { color: "#f1f5f9" } }}>
                    Dashboard
                  </Button>
                </Link>
              )}
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", px: 1 }}
              >
                {user.first_name} {user.last_name}
              </Typography>
              <Button
                variant="text"
                onClick={handleLogout}
                sx={{ color: "#94a3b8", "&:hover": { color: "#f1f5f9" } }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href={login} style={{ textDecoration: "none" }}>
                <Button variant="text" sx={{ color: "#94a3b8", "&:hover": { color: "#f1f5f9" } }}>
                  Log In
                </Button>
              </Link>
              <Link href={register} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                    "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)" },
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
