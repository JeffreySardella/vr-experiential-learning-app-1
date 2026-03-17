import { useEffect, useState, ComponentType } from "react";
import { useRouter } from "next/router";
import { apiGet } from "@/lib/api";
import { login, dashboardAdmin, dashboardInstructor, dashboardStudent } from "@/links/links";
import { Box, CircularProgress } from "@mui/material";

type Role = "admin" | "instructor" | "student";

interface UserData {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  groups: { name: string }[];
  institution: number | null;
  programs: number[];
  courses: number[];
}

const roleDashboard: Record<Role, string> = {
  admin: dashboardAdmin,
  instructor: dashboardInstructor,
  student: dashboardStudent,
};

function getUserRole(groups: { name: string }[]): Role | null {
  if (groups.some((g) => g.name === "admin")) return "admin";
  if (groups.some((g) => g.name === "instructor")) return "instructor";
  if (groups.some((g) => g.name === "student")) return "student";
  return null;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P & { user: UserData }>,
  allowedRoles: Role[]
) {
  return function AuthGuardedComponent(props: P) {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
      const check = async () => {
        try {
          const res = await apiGet("/api/auth/user/");
          if (!res.ok) { router.replace(login); return; }
          const data: UserData = await res.json();
          const role = getUserRole(data.groups);
          if (!role || !allowedRoles.includes(role)) {
            router.replace(roleDashboard[role ?? "student"]);
            return;
          }
          setUser(data);
        } catch { router.replace(login); }
        setChecked(true);
      };
      check();
    }, [router]);

    if (!checked) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      );
    }
    if (!user) return null;
    return <WrappedComponent {...props} user={user} />;
  };
}
