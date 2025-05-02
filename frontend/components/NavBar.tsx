import { login, root } from "@/links/links";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";

export default function NavBar() {
    return (
        <AppBar position="fixed" style={{ zIndex: 1100 }}>
            <Container>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Button color="inherit" href={root}>Academ-VR</Button>
                    <Box>
                        <Button color="inherit" variant="outlined" href={login}>Log In</Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}