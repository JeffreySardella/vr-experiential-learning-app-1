import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";


interface AnnouncementsListProps {
    courseId: number;
    setDisplay: (display: DisplayOption) => void;
    setSelectedAnnouncementId: (announcementId: number | null) => void;
}


const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ courseId, setDisplay, setSelectedAnnouncementId }) => {
    const [announcements, setAnnouncements] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${process.env.API_URL}/api/institutions/course/${courseId}/announcements`);
                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        fetchAnnouncements();
    }, [courseId]);

    const handleEdit = (announcementId: number) => {
        setSelectedAnnouncementId(announcementId);
        setDisplay("edit announcement");
    };

    const navigateToCreate = () => {
        setDisplay("create announcement");
    };

    return (
        <Box>
            <Typography variant="h4">Announcements</Typography>
            <Button variant="outlined" onClick={() => navigateToCreate()}>Create Announcement</Button>

            {announcements.map((announcement) => (
                <Box key={announcement.id} mt={2}>
                    <Typography variant="h6">{announcement.title}</Typography>
                    <Typography>Date: {new Date(announcement.datetime_created).toLocaleDateString()}</Typography>
                    <Typography>{announcement.body}</Typography>
                    <Button variant="outlined" onClick={() => handleEdit(announcement.id)}>Edit</Button>
                </Box>
            ))}
        </Box>
    );
}

export default AnnouncementsList;
