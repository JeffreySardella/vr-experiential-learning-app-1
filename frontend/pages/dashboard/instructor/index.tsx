import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import General from "@/components/instructor/general";
import SelectedCourse from "@/components/SelectedCourse";

const inter = Inter({ subsets: ["latin"] });

const Dashboard = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedGeneral, setSelectedGeneral] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`${process.env.API_URL}/api/auth/user`, {
            credentials: 'include',
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
      return <p>Select one of your courses to view their details.</p>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        style={{
          width: "200px",
          flexShrink: 0,
          zIndex: 1000
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => selectGeneral()}>
            <ListItemText primary="General" />
          </ListItem>
          {courses.map((course) => (
            <ListItem
              key={course.id}
              button
              onClick={() => handleCourseClick(course.id)}
            >
              <ListItemText primary={course.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main
        className={inter.className}
        style={{ flexGrow: 1, padding: "16px" }}
      >
        {selectedGeneral ? <General /> : renderCourseDetails()}
      </main>
    </div>
  );
};

export default Dashboard;
