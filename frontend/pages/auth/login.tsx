import { Box, Button, Container, List, ListItem, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
    const router = useRouter()

    const [email, setEmail] = useState<String>("")
    const [password, setPassword] = useState<String>("")

    const [errors, setErrors] = useState<String[]>([])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const login = async () => {
            try {
                const data = {
                    "email": email,
                    "password": password,
                }

                await fetch(`${process.env.API_URL}/api/auth/login/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                }).then(async (response) => {
                    const json: any = await response.json()
                    console.log(json)

                    if (response.status === 200) {
                        try{
                            const group = json['user']['groups'][0]['name']
                            if (group === 'admin') {
                                router.replace('/institutions')
                            } else if (group === 'instructor') {
                                router.replace('/dashboard/instructor')
                            }
                        }catch{
                            router.replace('/institutions')
                        }
                    return
                    }

                    let backendErrors = []

                    console.log(json)

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

        login()
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
                    Log In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        value={email}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        value={password}
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
                        Log In
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}