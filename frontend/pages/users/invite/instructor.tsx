import {
  Box,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Institution } from "../../institutions/interfaces";
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
  const [institutions, setInstitutions] = useState<Institution[]>();
  const [email, setEmail] = useState<string>("");
  const [institution, setInstitution] = useState<string>("");
  const [errors, setErrors] = useState<String[]>();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/institutions/`
        );
        const data: Institution[] = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutions();
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submit = async () => {
      try {
        const data = {
          email: email,
          institution_id: institution,
        };

        await fetch(`${process.env.API_URL}/api/auth/invite/instructors/`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).then(async (response) => {
          if (response.status === 204) {
            router.replace(login);
            return;
          }

          const json = await response.json();

          let backendErrors = [];

          for (const item in json) {
            if (typeof json[item] === "string") {
              backendErrors.push(json[item]);
              continue;
            }

            for (const message of json[item]) {
              backendErrors.push(item + ": " + message);
            }
          }

          setErrors(backendErrors);
        });
      } catch (error) {
        console.error(error);
      }
    };

    submit();
  };

  return (
    <PageContainer sx={{ background: "#0a0f1e" }}>
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 4 }}>
        <SectionHeader title="Invite Instructor Users" gradient align="center" />

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

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel sx={{ color: "#94a3b8", "&.Mui-focused": { color: "#3b82f6" } }}>
                Select an Institution
              </InputLabel>
              <Select
                required
                fullWidth
                name="institution"
                id="institution"
                input={<OutlinedInput label="Select an Institution" />}
                onChange={(e) => setInstitution(e.target.value)}
                value={institution}
                sx={darkSelectSx}
              >
                {institutions?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {errors && errors.length > 0 && (
              <List sx={{ py: 1 }}>
                {errors.map((e, i) => (
                  <ListItem key={i} sx={{ py: 0.5 }}>
                    <Typography variant="body2" sx={{ color: "#ef4444" }}>
                      {e}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}

            <GradientButton type="submit" fullWidth sx={{ mt: 2 }}>
              Invite
            </GradientButton>
          </Box>
        </GlassCard>
      </Box>
    </PageContainer>
  );
}

export default withAuth(ManageInstructors, ["admin", "instructor"]);
