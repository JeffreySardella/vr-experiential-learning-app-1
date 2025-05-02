import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Subject } from '../../../../../../interfaces';

const SubjectPage: React.FC = () => {
    const router = useRouter();
    const { id, programId, courseId, subjectId } = router.query;
    const [subject, setSubject] = useState<Subject>();
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [description, setDescription] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const fetchSubject = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subject');
            }
            const data: Subject = await response.json();
            setSubject(data);
            setNewName(data.name); // Set initial value for newName
            setDescription(data.description); // Set initial value for description
        } catch (error) {
            console.error('Error fetching subject:', error);
        }
    };

    const handleEditName = () => {
        setEditingName(true);
    };

    const handleSaveName = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) {
                throw new Error('Failed to update subject name');
            }
            // After successfully updating the name, set editingName to false
            setEditingName(false);
            router.reload();
        } catch (error) {
            console.error('Error updating subject name:', error);
        }
    };
    
    const handleDeleteSubject = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete subject');
            }
            // Redirect to the course page after deleting the subject
            router.push(`/institutions/${id}/program/${programId}/course/${courseId}`);
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    const handleAddDescription = async () => {
        try {
            const response = await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/${subjectId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: newDescription }), // Send description in the request body
            });
            if (!response.ok) {
                throw new Error('Failed to add subject description');
            }
            // After successfully adding the description, update the state with the new description from the response
            const data = await response.json();
            console.log('Response data:', data); // Debugging: Check the response data
            setDescription(data.description); // Update description state with the new description
            setNewDescription(''); // Clear the newDescription state
            console.log('Description added successfully');
        } catch (error) {
            console.error('Error adding subject description:', error);
        }
    };
    
    
    

    useEffect(() => {
        if (id && programId && courseId && subjectId) {
            fetchSubject();
        }
    }, [id, programId, courseId, subjectId]);

    return (
        <div>
            {subject && (
                <>
                    <h1>Subject Details: {editingName ? <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} /> : subject.name}</h1>
                    {editingName ? (
                        <button onClick={handleSaveName}>Save Name</button>
                    ) : (
                        <button onClick={handleEditName}>Edit Subject Name</button>
                    )}
                    <button onClick={handleDeleteSubject}>Delete Subject</button>
                    <br />
                    <h2>Description:</h2>
                    <p>{description}</p>
                    <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                    <button onClick={handleAddDescription}>Add Description</button>
                </>
            )}
        </div>
    );
    
};

export default SubjectPage;
