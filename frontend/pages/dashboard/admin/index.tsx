import { Button } from "@mui/material";
import { useRouter } from "next/router";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div>
      <Button
        color="primary"
        type="button"
        variant="outlined"
        onClick={() => router.push("/institutions")}
      >
        Manage Institutions
      </Button>
      <Button
        color="primary"
        type="button"
        variant="outlined"
        onClick={() => router.push("/users/course/instructor")}
      >
        Add Instructors to Courses
      </Button>
      <Button
        color="primary"
        type="button"
        variant="outlined"
        onClick={() => router.push("/users/invite/admin")}
      >
        Invite Admins
      </Button>
      <Button
        color="primary"
        type="button"
        variant="outlined"
        onClick={() => router.push("/users/delete")}
      >
        Delete Users
      </Button>
    </div>
  );
};

export default Dashboard;
