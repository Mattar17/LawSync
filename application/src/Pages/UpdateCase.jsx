import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CaseInfoInputs from "../Components/CaseInfoInputs.jsx";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function UpdateCase({ handleCasesChanged }) {
  const { case_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    case_number: "",
    case_year: "",
    client_name: "",
    client_opponent_name: "",
    client_role: "",
    client_opponent_role: "",
    client_national_id: "",
    client_opponent_national_id: "",
    latest_court_session_date: "",
    next_court_session_date: "",
    case_status: "",
  });

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/${case_id}`);
        const data = await res.json();
        console.log("Fetched case data:", data);
        setFormData(data.data);
        console.log("Form data set to:", data.data);
      } catch (error) {
        console.error("Error fetching case data:", error);
      }
    };

    fetchCaseData();
  }, [case_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (data) => {
    fetch(`${VITE_API_URL}/${case_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          console.log("Case updated successfully:", data.case);
          handleCasesChanged();
          navigate("/cases");
        }
      });
  };

  return (
    <div className="case_card min-h-[92vh] mx-auto w-full p-12 shadow-lg">
      {formData && (
        <CaseInfoInputs
          submitCase={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          submitLabel="حفظ التعديلات"
          disableCaseNumber={true}
        />
      )}
    </div>
  );
}
