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
    client_opponent_national_id: "",
    latest_court_session_date: "",
    next_court_session_date: "",
    case_status: "قضية جديدة",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (data) => {
    fetch(VITE_API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Case added successfully:", data.case);
          handleCasesChanged();
          navigate("/cases");
        } else {
          console.error("Error adding case:", data);
        }
      });
  };

  return (
    <div className="case_card min-h-[92vh] mx-auto w-full p-12 shadow-lg">
      <CaseInfoInputs
        submitCase={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        submitLabel={"إضافة القضية"}
      />
    </div>
  );
}
