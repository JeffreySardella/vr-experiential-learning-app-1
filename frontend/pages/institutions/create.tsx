import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/router";

const CreateInstitution = () => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/institutions/`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        router.push("/institutions");
      } else {
        console.error(
          `Failed to create institution. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "25vh",
      }}
    >
      <form style={{ textAlign: "center", width: "400px" }}>
        <h1 style={{ fontSize: "2em" }}>Create New Institution</h1>
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
        <div style={{ marginTop: "10px" }}>
          <button
            type="button"
            onClick={handleCreate}
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
        </div>
      </form>
    </div>
  );
};

export default CreateInstitution;
