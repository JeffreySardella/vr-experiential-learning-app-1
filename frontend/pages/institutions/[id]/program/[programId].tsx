import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { Program, Course } from '../../interfaces';
import Link from 'next/link';

const ProgramPage: React.FC = () => {
  const router = useRouter();
  const { id, programId } = router.query;
  const [program, setProgram] = useState<Program>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAddCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      // After creating the program, refetch the programs list
      fetchCourses();
      setName(""); // Clear the input field
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchProgram = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}`
      );
      const data: Program = await response.json();
      setProgram(data);
    } catch (error) {
      console.error("Error fetching program:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses for id:", id, "programId:", programId);
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/`
      );
      const data: Course[] = await response.json();
      console.log("Fetched courses:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (id && programId) {
      fetchProgram();
      fetchCourses();
    }
  }, [id, programId]);

  return (
    <div style={{ paddingLeft: "25px" }}>
      <h1 style={{ fontSize: "2em" }}>Program: {program?.name}</h1>
      <p>______________________________________________</p>
      <h2 style={{ fontSize: "1.5em" }}>Courses: </h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link
              href={`/institutions/${id}/program/${programId}/course/${course.id}`}
            >
              <strong>{course.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <br></br>
      <h3 style={{ fontSize: "1em", fontWeight: "bold" }}>Add Course:</h3>
      <form onSubmit={handleAddCourse}>
        <label>
          Name:
          <p></p>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{
              border: "1px solid black",
              padding: "8px",
              borderRadius: "4px",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#FFFFFF",
            borderRadius: "4px",
            border: "none",
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default ProgramPage;
