import { login } from "@/links/links"
import { Box, Button, Container, List, ListItem, TextField, Typography } from "@mui/material"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react"

export default function Signup() {
    const router = useRouter()

    const searchParams = useSearchParams()
    const uid = searchParams.get('uid')
    const token = searchParams.get('token')

    const [firstname, setFirstname] = useState<String>("");
    const [lastname, setLastname] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [password, setPassword] = useState<String>("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<String>("");

    const [errors, setErrors] = useState<String[]>([]);

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
                    "new_password1": password,
                    "new_password2": passwordConfirmation,
                    "uid": uid,
                    "token": token,
                    "email": email,
                    "first_name": firstname,
                    "last_name": lastname,
                }

                await fetch(`${process.env.API_URL}/api/auth/register/admins/`, {
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
                    Admin Sign Up
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