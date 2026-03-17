import { Box, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import GradientButton from "@/components/ui/GradientButton";
import GlassCard from "@/components/ui/GlassCard";

const General = () => {
  const router = useRouter();

  const handleAddCourse = () => {
    // TODO: Add functionality
  };

  return (
    <GlassCard sx={{ p: 3 }}>
      <Typography
        variant="h6"
        sx={{ color: "#f1f5f9", fontWeight: 600, mb: 2 }}
      >
        Quick Actions
      </Typography>
      <Stack direction="row" spacing={2}>
        <GradientButton onClick={handleAddCourse}>Add Course</GradientButton>
        <GradientButton onClick={() => router.push("/video/uploadvideo")}>
          Upload Video
        </GradientButton>
      </Stack>
    </GlassCard>
  );
};

export default General;
