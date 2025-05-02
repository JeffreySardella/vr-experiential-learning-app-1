import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Institution } from "./interfaces";

const InstitutionList = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/institutions/`
        );
        const data: Institution[] = await response.json();
        setInstitutions(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInstitutions();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>Institutions</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {institutions.map((institution) => (
          <li key={institution.id} style={{ marginBottom: "10px" }}>
            <Link href={`/institutions/${institution.id}`}>
              <strong>{institution.name}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "10px" }}>
        <button
          type="button"
          onClick={() => router.push("/institutions/create")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "#FFFFFF",
            borderRadius: "4px",
            border: "none",
          }}
        >
          Create Institution
        </button>
      </div>
    </div>
  );
};

export default InstitutionList;
