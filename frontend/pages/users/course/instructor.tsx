import { Box, Button, Container, FormControl, FormControlLabel, InputLabel, List, ListItem, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Institution } from "../../institutions/interfaces";
import router from "next/router";
import { login } from "@/links/links";

export default function ManageInstructors() {

    const [email, setEmail] = useState<string>('')
    const [id, setId] = useState<any>()
    const [courses, setCourses] = useState<any[]>([])

    const [selectCourses, setSelectCourses] = useState<any[]>([])
    const [selectedCourse, setSelectedCourse] = useState<any>()

    const [errors, setErrors] = useState<string[]>()

    const submit = async () => {
            
        let newErrors = []
        setErrors([])

        try {
            await fetch(`${process.env.API_URL}/api/users/${email}`, {
                method: "GET",
                credentials: 'include',
            }).then((res) => {
                return res.json()
            }).then(async (json: any) => {
                if (Object.keys(json).length === 0) {
                    newErrors.push('Email not associated with any user');
                    setErrors(newErrors)
                    return
                }

                setId(json.pk)

                const groups = json.groups
                let isInstructor = false;

                for (const group of groups) {
                    if (group.name === 'instructor') {
                        isInstructor = true;
                    }
                }

                if (!isInstructor) {
                    newErrors.push('User is not an instructor');
                    setErrors(newErrors)
                    return
                }                

                const user = await fetch(`${process.env.API_URL}/api/users/${email}`, {
                    method: "GET",
                    credentials: 'include',
                }).then((res) => {
                    return res.json()
                })

                let instructorCourses = []

                for (const course of user.courses) {
                    instructorCourses.push({id: course.id, name: course.name, program: course.name})
                }
                
                setCourses(user.courses)

                if (user.courses.length === 0) {
                    newErrors.push('Instructor not associated with any courses')
                    setErrors(newErrors)
                }

                // Get select courses
                const programs = await getPrograms(user.institution.id)

                const courseIds = []

                for (const course of instructorCourses) {
                    courseIds.push(course.id)
                }

                let newCourses: any[] = []

                for (const program of programs) {
                    const programCourses = await getCourses(user.institution.id, program.id)
                    for (const programCourse of programCourses) {
                        if (!courseIds.includes(programCourse.id)) {
                            newCourses.push({id: programCourse.id, name: programCourse.name, program: program.name})
                        }
                    }
                }

                setSelectCourses(newCourses)
            })
        } catch (error) {
            console.error(error)
        }
    }

    const getPrograms = async (institution: number) => {
        try {
            return await fetch(`${process.env.API_URL}/api/institutions/${institution}/programs`, {
                method: "GET",
                credentials: 'include',
            }).then((res) => {
                return res.json()
            }).then((json) => {
                return json
            })
        } catch (error) {
            console.error(error)
        }
    }

    const getCourses = async (institution: number, program: number) => {
        try {
            return await fetch(`${process.env.API_URL}/api/institutions/${institution}/programs/${program}/courses`, {
                method: "GET",
                credentials: 'include',
            }).then((res) => {
                return res.json()
            }).then((json) => {
                return json
            })
        } catch (error) {
            console.error(error)
        }
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setCourses([])

        submit()
    }

    const removeCourse = async (courseId: number, userId: number) => {
        await fetch(`${process.env.API_URL}/api/courses/${courseId}/users/${userId}`, {
            method: "DELETE",
            credentials: 'include',
        })

        submit()
    }

    const addCourse = async (courseId: number, userId: number) => {
        const data = {
            "user_id": userId,
        }

        let newErrors: string[] = []

        await fetch(`${process.env.API_URL}/api/courses/${courseId}/users`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(async (res) => {
            if (res.status === 204) {
                newErrors.push("Added instructor to the course")
                return
            }

            const json = await res.json()
            console.log(res)

            for (const item in json) {
                if (typeof(json[item]) === 'string') {
                    newErrors.push(json[item])
                    continue
                }

                for (const message of json[item]) {
                    newErrors.push(item + ": " + message)
                }
            }
        })

        setErrors(newErrors)
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
                    Invite instructor users to courses
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

                    <Button
                        color="primary"
                        type="submit"
                        fullWidth
                        variant="outlined"
                        className="mt-2"
                    >
                        Search
                    </Button>

                    <FormControl
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        <InputLabel>{"Select a Course"}</InputLabel>
                        <Select
                            fullWidth
                            name="program"
                            id="program"
                            input={<OutlinedInput label="Select a Course" />}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value)
                            }}
                            value={selectedCourse}
                        >
                            {
                                selectCourses.map((e) => (
                                    <MenuItem
                                        key={e.id}
                                        value={e.id}
                                    >
                                        {e.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                        <Button
                            color="info"
                            type="submit"
                            fullWidth
                            variant="outlined"
                            className="mt-4"
                            onClick={() => addCourse(selectedCourse, id)}
                        >
                            Add
                        </Button>
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

                    <Box>
                        {
                            courses?.map((e, i) => (
                                <Box display={"flex"} justifyContent={"space-between"} mt={2} key={i}>
                                    <Typography component="h6" variant="h6">
                                        Program: {e.program}
                                        <br />
                                        Class: {e.name}
                                    </Typography>
                                    <Button color="error" onClick={() => removeCourse(e.id, id)}>
                                        Delete
                                    </Button>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}