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
    case_status: "",
  });

  useEffect(() => {
    fetch(`${VITE_API_URL}/${case_id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data.data));
  }, [case_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${VITE_API_URL}/${case_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          handleCasesChanged();
          navigate("/cases");
        }
      });
  };

  return (
    <div className="case_card min-h-[91vh] mx-auto w-full p-12 shadow-lg">
      <CaseInfoInputs
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        submitLabel="حفظ التعديلات"
        disableCaseNumber={true}
      />
    </div>
  );
}
