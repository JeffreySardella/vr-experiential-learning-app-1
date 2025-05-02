import { Box, Button, Container, FormControl, FormControlLabel, InputLabel, List, ListItem, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Institution } from "../../institutions/interfaces";
import router from "next/router";
import { login } from "@/links/links";

export default function ManageInstructors() {
    const [institutions, setInstitutions] = useState<Institution[]>()

    const [email, setEmail] = useState<string>('')
    const [institution, setInstitution] = useState<string>('')

    const [errors, setErrors] = useState<String[]>()

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/institutions/`);
                const data: Institution[] = await response.json();
                setInstitutions(data);
            } catch (error) {
                console.error(error)
            }
        }

        fetchInstitutions();
    }, []);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const submit = async () => {
            try {
                const data = {
                    "email": email,
                    "institution_id": institution,
                }

                await fetch(`${process.env.API_URL}/api/auth/invite/instructors/`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then(async (response) => {
                    console.log(email, institution);
                    
                    if (response.status === 204) {
                        router.replace(login)
                        return
                    }

                    const json = await response.json()
                    console.log(response)

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
            } catch (error) {
                console.error(error);
            }
        }

        submit()
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
                    Invite instructor users
                </Typography>

                <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
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

                    <FormControl
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <InputLabel id="demo-multiple-name-label">{"Select an Institution"}</InputLabel>
                        <Select
                            required
                            fullWidth
                            name="institution"
                            id="institution"
                            input={<OutlinedInput label="Select an Institution" />}
                            onChange={(e) => {
                                setInstitution(e.target.value)
                            }}
                            value={institution}
                        >
                            {
                                institutions?.map((p) => (
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
                                errors?.map((e, i) => (
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
                        className="mt-2"
                    >
                        Invite
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}