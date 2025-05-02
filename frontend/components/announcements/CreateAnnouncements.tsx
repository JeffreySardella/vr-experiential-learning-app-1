import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useState } from "react";

export default function CreateAnnouncements({ courseId, setDisplay }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const announcementData = {
            title: title,
            body: content
        };

        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/course/${courseId}/announcements`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(announcementData)
            });

            if (!response.ok) {
                throw new Error("Failed to create announcement");
            }

            setTitle("");
            setContent("");
            setError(null);
            setDisplay("announcements");

        } catch (error) {
            console.error("Error creating announcement:", error);
            setError(error.message);
        }
    };

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
                <Typography component="h1" variant="h5">
                    Create Announcement
                </Typography>

                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextareaAutosize
                        minRows={10}
                        placeholder="Announcement Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: "100%", resize: "none", marginBottom: "16px" }}
                    />

                    {error && (
                        <Typography variant="body2" color="error" align="center" gutterBottom>
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                    >
                        Create
                    </Button>
                </form>
            </Box>
        </Container>
    );
}
