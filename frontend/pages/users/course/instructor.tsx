import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import router from "next/router";
import { login } from "@/links/links";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#f1f5f9",
    "& fieldset": { borderColor: "rgba(59, 130, 246, 0.2)" },
    "&:hover fieldset": { borderColor: "rgba(59, 130, 246, 0.4)" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
  "& .MuiInputLabel-root": { color: "#94a3b8" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
};

const darkSelectSx = {
  color: "#f1f5f9",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3b82f6",
  },
  "& .MuiSvgIcon-root": { color: "#94a3b8" },
};

function ManageInstructors({ user }: { user: any }) {
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<any>();
  const [courses, setCourses] = useState<any[]>([]);

  const [selectCourses, setSelectCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>();

  const [errors, setErrors] = useState<string[]>();

  const submit = async () => {
    let newErrors = [];
    setErrors([]);

    try {
      await fetch(`${process.env.API_URL}/api/users/${email}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then(async (json: any) => {
          if (Object.keys(json).length === 0) {
            newErrors.push("Email not associated with any user");
            setErrors(newErrors);
            return;
          }

          setId(json.pk);

          const groups = json.groups;
          let isInstructor = false;

          for (const group of groups) {
            if (group.name === "instructor") {
              isInstructor = true;
            }
          }

          if (!isInstructor) {
            newErrors.push("User is not an instructor");
            setErrors(newErrors);
            return;
          }

          const user = await fetch(
            `${process.env.API_URL}/api/users/${email}`,
            {
              method: "GET",
              credentials: "include",
            }
          ).then((res) => res.json());

          let instructorCourses = [];

          for (const course of user.courses) {
            instructorCourses.push({
              id: course.id,
              name: course.name,
              program: course.name,
            });
          }

          setCourses(user.courses);

          if (user.courses.length === 0) {
            newErrors.push("Instructor not associated with any courses");
            setErrors(newErrors);
          }

          const programs = await getPrograms(user.institution.id);

          const courseIds = [];

          for (const course of instructorCourses) {
            courseIds.push(course.id);
          }

          let newCourses: any[] = [];

          for (const program of programs) {
            const programCourses = await getCourses(
              user.institution.id,
              program.id
            );
            for (const programCourse of programCourses) {
              if (!courseIds.includes(programCourse.id)) {
                newCourses.push({
                  id: programCourse.id,
                  name: programCourse.name,
                  program: program.name,
                });
              }
            }
          }

          setSelectCourses(newCourses);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getPrograms = async (institution: number) => {
    try {
      return await fetch(
        `${process.env.API_URL}/api/institutions/${institution}/programs`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((json) => json);
    } catch (error) {
      console.error(error);
    }
  };

  const getCourses = async (institution: number, program: number) => {
    try {
      return await fetch(
        `${process.env.API_URL}/api/institutions/${institution}/programs/${program}/courses`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((json) => json);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCourses([]);
    submit();
  };

  const removeCourse = async (courseId: number, userId: number) => {
    await fetch(
      `${process.env.API_URL}/api/courses/${courseId}/users/${userId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    submit();
  };

  const addCourse = async (courseId: number, userId: number) => {
    const data = {
      user_id: userId,
    };

    let newErrors: string[] = [];

    await fetch(`${process.env.API_URL}/api/courses/${courseId}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 204) {
        newErrors.push("Added instructor to the course");
        return;
      }

      const json = await res.json();

      for (const item in json) {
        if (typeof json[item] === "string") {
          newErrors.push(json[item]);
          continue;
        }

        for (const message of json[item]) {
          newErrors.push(item + ": " + message);
        }
      }
    });

    setErrors(newErrors);
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Box sx={{ maxWidth: 560, mx: "auto", mt: 4 }}>
        <SectionHeader
          title="Manage Instructor Courses"
          gradient
          align="center"
        />

        <GlassCard sx={{ p: 3 }}>
          <Box component="form" onSubmit={onSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              sx={darkTextFieldSx}
            />

            <GradientButton type="submit" fullWidth sx={{ mt: 1 }}>
              Search
            </GradientButton>

            {selectCourses.length > 0 && (
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel
                  sx={{
                    color: "#94a3b8",
                    "&.Mui-focused": { color: "#3b82f6" },
                  }}
                >
                  Select a Course
                </InputLabel>
                <Select
                  fullWidth
                  name="program"
                  id="program"
                  input={<OutlinedInput label="Select a Course" />}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  value={selectedCourse || ""}
                  sx={darkSelectSx}
                >
                  {selectCourses.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
                <GradientButton
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => addCourse(selectedCourse, id)}
                >
                  Add
                </GradientButton>
              </FormControl>
            )}

            {errors && errors.length > 0 && (
              <List sx={{ py: 1 }}>
                {errors.map((e, i) => (
                  <ListItem key={i} sx={{ py: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: e.includes("Added") ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {e}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}

            {courses.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#f1f5f9", fontWeight: 600, mb: 1 }}
                >
                  Current Courses
                </Typography>
                {courses.map((e, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      mb: 1,
                      background: "rgba(59, 130, 246, 0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(59, 130, 246, 0.08)",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94a3b8", fontSize: "0.75rem" }}
                      >
                        Program: {e.program}
                      </Typography>
                      <Typography sx={{ color: "#f1f5f9", fontWeight: 500 }}>
                        {e.name}
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={() => removeCourse(e.id, id)}
                      sx={{
                        color: "#ef4444",
                        "&:hover": {
                          background: "rgba(239, 68, 68, 0.1)",
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </GlassCard>
      </Box>
    </PageContainer>
  );
}

export default withAuth(ManageInstructors, ["admin"]);
