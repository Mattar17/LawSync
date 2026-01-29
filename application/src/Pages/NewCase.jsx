import { useState } from "react";
import CaseInfoInputs from "../Components/CaseInfoInputs.jsx";
import { useNavigate } from "react-router-dom";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function NewCase({ handleCasesChanged }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    case_number: "",
    case_year: `${new Date().getFullYear()}`,
    client_name: "",
    client_opponent_name: "",
    client_role: "",
    client_opponent_role: "",
    client_national_id: "",
    case_status: "قضية جديدة",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(VITE_API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          handleCasesChanged();
          navigate("/cases");
        }
      });
  };

  return (
    <div className="case_card min-h-[92vh] mx-auto w-full p-12 shadow-lg">
      <CaseInfoInputs
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        submitLabel={"إضافة القضية"}
      />
    </div>
  );
}
