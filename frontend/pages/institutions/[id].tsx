import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { Institution } from "./interfaces";
import { Program } from "./interfaces";
import Link from "next/link";

const InstitutionDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [institution, setInstitution] = useState<Institution>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [name, setName] = useState("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await fetch(`${process.env.API_URL}/api/institutions/${id}/programs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      // After creating the program, refetch the programs list
      fetchPrograms();
      setName(""); // Clear the input field
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstitution = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}`
      );
      const data: Institution = await response.json();
      setInstitution(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/institutions/${id}/programs/`
      );
      const data: Program[] = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInstitution();
    fetchPrograms();
  }, []);

  return (
    <div style={{ paddingLeft: "25px" }}>
      <h1 style={{ fontSize: "2em" }}>Institution: {institution?.name}</h1>
      <p>______________________________________________</p>
      <h2 style={{ fontSize: "1.5em" }}>Programs: </h2>
      <ul>
        {programs.map((program) => (
          <li key={program.id}>
            <Link href={`/institutions/${id}/program/${program.id}`}>
              <strong>{program.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <br></br>
      <h3 style={{ fontSize: "1em", fontWeight: "bold" }}>Add Program:</h3>
      <form onSubmit={handleCreate}>
        <label style={{ display: "block", marginBottom: "10px" }}>
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

export default InstitutionDetailPage;
