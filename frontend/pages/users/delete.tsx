import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import { useState } from "react";
import { withAuth } from "@/lib/auth";
import PageContainer from "@/components/ui/PageContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import GlassCard from "@/components/ui/GlassCard";

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

function DeleteUser({ user }: { user: any }) {
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<String[]>([]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let newErrors = [];
    setErrors([]);

    const deleteSearchedUser = async () => {
      try {
        await fetch(`${process.env.API_URL}/api/users/${email}`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((user) => {
            if (Object.keys(user).length === 0) {
              newErrors.push("Email not associated with any user");
              setErrors(newErrors);
              return;
            }

            newErrors.push("User successfully deleted");
            setErrors(newErrors);

            deleteUser(user.pk);
          });
      } catch (error) {
        console.error(error);
      }
    };

    const deleteUser = async (pk: number) => {
      try {
        await fetch(`${process.env.API_URL}/api/users/${pk}`, {
          method: "DELETE",
          credentials: "include",
        });
      } catch (error) {
        console.error(error);
      }
    };

    deleteSearchedUser();
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Box
        sx={{
          maxWidth: 480,
          mx: "auto",
          mt: 4,
        }}
      >
        <SectionHeader title="Delete User" gradient align="center" />

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

            {errors.length > 0 && (
              <List sx={{ py: 1 }}>
                {errors.map((e, i) => (
                  <ListItem key={i} sx={{ py: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: e.includes("successfully")
                          ? "#22c55e"
                          : "#ef4444",
                      }}
                    >
                      {e}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}

            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                color: "#ef4444",
                borderColor: "rgba(239, 68, 68, 0.3)",
                "&:hover": {
                  borderColor: "#ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </GlassCard>
      </Box>
    </PageContainer>
  );
}

export default withAuth(DeleteUser, ["admin"]);
