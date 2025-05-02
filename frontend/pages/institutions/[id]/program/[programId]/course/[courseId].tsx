// CoursePage.tsx

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { Subject } from "@/pages/institutions/interfaces";
import Link from "next/link";

const CoursePage: React.FC = () => {
  const router = useRouter();
  const { id, programId, courseId } = router.query;
  const [course, setCourse] = useState<any>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState<any>(false);
  const [btnContent, setBtnContent] = useState<any>("Add");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleDeleteCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      // Redirect to the programs list or homepage after deletion
      router.push(`/institutions/${id}/program/${programId}/`);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}`
      );
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        console.error("Failed to fetch course:", response.status);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/add_course?course_id=${courseId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.text();
        console.log(data);
        if (data == "true") {
          setFlag(true);
          setBtnContent("Added");
        } else {
          setFlag(false);
          setBtnContent("Add");
        }
      } else {
        console.error("Failed to fetch course:", response.status);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const handleAddCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.API_URL}/api/institutions/add_course/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          course_id: courseId,
        }),
      });

      fetchCourse();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add subject");
      }
      // After creating the program, refetch the subjects list
      fetchSubjects();
      setName(""); // Clear the input field
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/${programId}/courses/${courseId}/subjects/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }
      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    if (id && programId && courseId) {
      fetchCourse();
      fetchSubjects();
    }
  }, [id, programId, courseId]);

  return (
    <div style={{ paddingLeft: "25px" }}>
      <h1 style={{ fontSize: "2em" }}>Course: {course?.name}</h1>

      <button onClick={handleDeleteCourse}>Delete Course</button>
      <h2>Subjects:</h2>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Link
              href={`/institutions/${id}/program/${programId}/course/${courseId}/subject/${subject.id}`}
            >
              <span>{subject.name}</span>
            </Link>{" "}
            - {subject.name}
          </li>
        ))}
      </ul>
      <h3>Add Subject</h3>
      <form onSubmit={handleAddSubject}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <button type="submit">Create</button>
      </form>

      <form onSubmit={handleAddCourse}>
        <button
          type="submit"
          disabled={flag}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: { flag } ? "#007BFF" : "gray",
            color: "#FFFFFF",
            borderRadius: "4px",
            border: "none",
          }}
        >
          {btnContent}
        </button>
      </form>
    </div>
  );
};

export default CoursePage;
