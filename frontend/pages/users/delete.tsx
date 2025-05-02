import { Box, Button, Container, FormControl, InputLabel, List, ListItem, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";

export default function DeleteUser() {

    const [email, setEmail] = useState<string>('')

    const [errors, setErrors] = useState<String[]>([])

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        let newErrors = [];
        setErrors([]);

        const deleteSearchedUser = async () => {
            try {
                await fetch(`${process.env.API_URL}/api/users/${email}`, {
                    method: "GET",
                    credentials: 'include',
                }).then((res) => {
                    return res.json()
                }).then((user) => {
                    if (Object.keys(user).length === 0) {
                        newErrors.push('Email not associated with any user');
                        setErrors(newErrors);
                        return
                    }

                    newErrors.push('User successfully deleted');
                    setErrors(newErrors);
                    
                    deleteUser(user.pk);
                })
            } catch (error) {
                console.error(error)
            }
        }

        const deleteUser = async (pk: number) => {
            try {
                await fetch(`${process.env.API_URL}/api/users/${pk}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
            } catch (error) {
                console.error(error)
            }
        }

        deleteSearchedUser();
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
                    Delete User
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
                        color="error"
                        type="submit"
                        fullWidth
                        variant="outlined"
                        className="mt-2"
                    >
                        Delete
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}