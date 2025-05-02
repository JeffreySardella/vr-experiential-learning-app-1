import { Box, Button, Container, FormControl, InputLabel, List, ListItem, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { login } from "@/links/links";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { Program } from "@/pages/institutions/interfaces";

export default function Signup() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const institution_id = searchParams.get("institution_id");
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    const [firstname, setFirstname] = useState<String>("");
    const [lastname, setLastname] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<String>("");
    const [programIds, setProgramIds] = useState<string | string[]>([]);

    const [programs, setPrograms] = useState<any[]>([]);

    const [errors, setErrors] = useState<String[]>([]);

    useEffect(() => {
        if (!institution_id) {
            return
        }

        const fetchPrograms = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/institutions/${institution_id}/programs/`);
                const data: Program[] = await response.json();
                setPrograms(data);
            } catch (error) {
                console.error(error)
            }
        }

        fetchPrograms();
    }, [institution_id]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        let newErrors = []

        if (password !== passwordConfirmation) {
            newErrors.push("Passwords do not match")
        }

        setErrors(newErrors)

        const register = async () => {
            try {
                const data = {
                    "email": email,
                    "new_password1": password,
                    "new_password2": passwordConfirmation,
                    "uid": uid,
                    "token": token,
                    "first_name": firstname,
                    "last_name": lastname,
                    "program_ids": typeof(programIds) === "string" ?
                        parseInt(programIds)
                        :
                        programIds.map((p) => {
                            return parseInt(p)
                        }
                    ),
                }

                await fetch(`${process.env.API_URL}/api/auth/register/instructors/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then(async (response) => {
                    if (response.status === 204) {
                        router.replace(login)
                        return
                    }

                    const json = await response.json()

                    let backendErrors = []

                    for (const item in json) {
                        if (typeof(json[item]) === 'string') {
                            backendErrors.push(json[item])
                            continue
                        }

                        for (const message of json[item]) {
                            backendErrors.push(item + ": " + message)
                        }
                    }

                    setErrors(backendErrors)
                })
            } catch (err) {
                console.error(err)
            }
        }

        register()
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" color="black">
                    Instructor Sign Up
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstname"
                        label="First Name"
                        name="firstname"
                        onChange={(e) => {
                            setFirstname(e.target.value)
                        }}
                        value={firstname}
                        autoFocus
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastname"
                        label="Last Name"
                        name="lastname"
                        onChange={(e) => {
                            setLastname(e.target.value)
                        }}
                        value={lastname}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        value={email}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        value={password}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        name="passwordConfirm"
                        type="password"
                        id="passwordConfirm"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setPasswordConfirmation(e.target.value)
                        }}
                        value={passwordConfirmation}
                    />

                    <FormControl
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <InputLabel id="demo-multiple-name-label">{"Select Program(s) *"}</InputLabel>
                        <Select
                            required
                            fullWidth
                            multiple
                            name="program"
                            id="program"
                            input={<OutlinedInput label="Select Program(s) *" />}
                            onChange={(e) => {
                                setProgramIds(e.target.value)
                            }}
                            value={programIds}
                        >
                            {
                                programs.map((p) => (
                                    <MenuItem
                                        key={p.id}
                                        value={p.id}
                                    >
                                        {p.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <Box color="red">
                        <List>
                            {
                                errors.map((e, i) => (
                                    <ListItem key={i}>
                                        {e}
                                    </ListItem>
                                ))
                            }
                        </List>
                    </Box>
                    
                    <Button
                        color="primary"
                        type="submit"
                        fullWidth
                        variant="outlined"
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
