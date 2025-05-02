import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useEffect, useState } from "react";

interface EditAnnouncementProps {
    courseId: number;
    announcementId: number;
    setDisplay: (display: DisplayOption) => void;
    setSelectedAnnouncementId: (announcementId: number | null) => void;
}

const EditAnnouncement: React.FC<EditAnnouncementProps> = ({ courseId, announcementId, setDisplay, setSelectedAnnouncementId }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const response = await fetch(
                    `${process.env.API_URL}/api/institutions/course/${courseId}/announcements/${announcementId}`,
                    {
                        credentials: 'include',
                    }
                );
                const data = await response.json();
                setTitle(data.title);
                setContent(data.body);
            } catch (error) {
                console.error("Error fetching announcement:", error);
                setError(error.message);
            }
        };

        fetchAnnouncement();
    }, [courseId, announcementId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const announcementData = {
            title: title,
            body: content
        };

        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/course/${courseId}/announcements/${announcementId}`, {
                method: "PUT",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(announcementData)
            });

            if (!response.ok) {
                throw new Error("Failed to update announcement");
            }

            setDisplay("announcements");
            setSelectedAnnouncementId(null);
            setError(null);

        } catch (error) {
            console.error("Error updating announcement:", error);
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
                    Edit Announcement
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
                        Update
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default EditAnnouncement;
