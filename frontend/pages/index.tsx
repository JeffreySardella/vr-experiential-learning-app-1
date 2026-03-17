import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeroSection from "@/components/landing/HeroSection";
import { dashboardAdmin, dashboardInstructor, dashboardStudent } from "@/links/links";

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/auth/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          const isAdmin = userData.groups.some(
            (group: { name: string }) => group.name === "admin"
          );
          const isInstructor = userData.groups.some(
            (group: { name: string }) => group.name === "instructor"
          );
          if (isAdmin) router.push(dashboardAdmin);
          else if (isInstructor) router.push(dashboardInstructor);
          else router.push(dashboardStudent);
          return;
        }
      } catch {
        // Not authenticated — show landing
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <main>
      <HeroSection />
    </main>
  );
};

export default Home;
