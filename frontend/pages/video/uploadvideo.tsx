import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Link, List, ListItem, TextField, Typography, Alert} from "@mui/material";
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const UploadVideo: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { id, programId, courseId } = router.query;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    try {
      const response = await fetch(`${process.env.API_URL}/api/video/uploadvideo/`, {
          method: 'POST',
          body: formData,
        });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload video');
      }
      // Clear the form data after successful upload
      setTitle("");
      setDescription("");
      setName("");
      setFile(undefined);
      // Set the success message
      setSuccessMessage("Video uploaded successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000); // Clear the message after 3 seconds
      setErrorMessage(""); // Clear any previous error message
    } catch (error: any) {
      console.error('Error uploading video', error);
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear any previous success message
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleUpload = async (event: any) => {
    const target = event.target as HTMLInputElement & {
      files: FileList;
    };
    if (target.files != null) {
        setFile(target.files[0]);
        setName(target.files[0].name);
    }
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
          Upload Video
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: '#DBD9D9', border: 1, borderRadius: 1, mt: 2, p: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="Title"
            type="text"
            sx={{ bgcolor: '#fff' }}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <TextareaAutosize
            required
            id="description"
            aria-label="Description"
            placeholder='Description'
            name="Description"
            minRows={3}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <Button
            component="label"
            variant="contained"
            tabIndex={-1}
            onChange={handleUpload}
          >
            Upload file
            <VisuallyHiddenInput type="file" />
          </Button>
          <Typography sx={{ mt: 1 }}>
            Selected File: {name}
          </Typography>
          <Button
            color="primary"
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ bgcolor: '#fff', mt: 2 }}
          >
            Upload
          </Button>
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default UploadVideo;
