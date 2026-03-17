import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Toolbar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import General from "@/components/instructor/general";
import SelectedCourse from "@/components/SelectedCourse";
import { withAuth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

const Dashboard = ({ user }: { user: any }) => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGeneral, setSelectedGeneral] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`${process.env.API_URL}/api/auth/user`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.courses) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchCourses();
  }, []);

  const selectGeneral = () => {
    setSelectedGeneral(true);
  };

  const handleCourseClick = (courseId) => {
    setSelectedCourse(courseId);
    setSelectedGeneral(false);
  };

  const renderCourseDetails = () => {
    if (selectedCourse !== null) {
      return <SelectedCourse courseId={selectedCourse} />;
    } else {
      return (
        <Typography sx={{ color: "#94a3b8" }}>
          Select one of your courses to view their details.
        </Typography>
      );
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#0a0f1e" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 1000,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgba(21, 27, 46, 0.95)",
            borderRight: "1px solid rgba(59, 130, 246, 0.1)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: 1,
              fontSize: "0.7rem",
              mb: 1,
            }}
          >
            Navigation
          </Typography>
        </Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => selectGeneral()}
              selected={selectedGeneral}
              sx={{
                "&.Mui-selected": {
                  background: "rgba(59, 130, 246, 0.15)",
                  borderRight: "3px solid #3b82f6",
                },
                "&:hover": {
                  background: "rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              <ListItemText
                primary="General"
                sx={{ "& .MuiListItemText-primary": { color: "#f1f5f9", fontWeight: selectedGeneral ? 600 : 400 } }}
              />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ borderColor: "rgba(59, 130, 246, 0.1)", my: 1 }} />
          <Box sx={{ px: 2, py: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: "0.7rem",
              }}
            >
              Courses
            </Typography>
          </Box>
          {courses.map((course) => (
            <ListItem key={course.id} disablePadding>
              <ListItemButton
                onClick={() => handleCourseClick(course.id)}
                selected={!selectedGeneral && selectedCourse === course.id}
                sx={{
                  "&.Mui-selected": {
                    background: "rgba(59, 130, 246, 0.15)",
                    borderRight: "3px solid #3b82f6",
                  },
                  "&:hover": {
                    background: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                <ListItemText
                  primary={course.name}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: "#f1f5f9",
                      fontWeight: !selectedGeneral && selectedCourse === course.id ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        className={inter.className}
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${drawerWidth}px`,
          background: "#0a0f1e",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Instructor Dashboard
        </Typography>
        {selectedGeneral ? <General /> : renderCourseDetails()}
      </Box>
    </Box>
  );
};

export default withAuth(Dashboard, ["instructor"]);
