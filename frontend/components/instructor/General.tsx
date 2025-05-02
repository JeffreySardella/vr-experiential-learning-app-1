import { Button } from "@mui/material";
import { useRouter } from "next/router";

const General = () => {
  const router = useRouter();

  const handleAddCourse = () => {
    // TODO: Add functionality
  };

  return (
    <div>
      <p>General page</p>
      <Button
        color="primary"
        type="submit"
        variant="outlined"
        onClick={handleAddCourse}
      >
        Add Course
      </Button>
      <Button
        color="primary"
        type="button"
        variant="outlined"
        onClick={() => router.push("/video/uploadvideo")}
      >
        Upload Video
      </Button>
    </div>
  );
};

export default General;
