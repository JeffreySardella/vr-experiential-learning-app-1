import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/auth/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          const isInstructor = userData.groups.some(
            (group) => group.name === "admin"
          );
          const isInstructor = userData.groups.some(
            (group) => group.name === "instructor"
          );
          if (isInstructor) {
            router.push("/dashboard/admin");
          }
          if (isInstructor) {
            router.push("/dashboard/instructor");
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return <main></main>;
};

export default Home;
