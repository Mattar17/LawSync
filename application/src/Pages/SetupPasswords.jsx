import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, ArrowLeft } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function SetupPasswords() {
  const [formData, setFormData] = useState({
    mainPassword: "",
    backupPassword: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.backupPassword.length < 2) return setError("Invalid Password");

    if (formData.mainPassword.length < 6)
      return setError("Password must be at least 6 characters");

    fetch(`${VITE_API_URL}/set-passwords`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "error") setError("something went wrong");
        else {
          setTimeout(() => navigate("/"), 1000);
          setSuccess("تم إضافة كلمة السر بنجاح✅");
        }
      });
    setFormData({ backupPassword: "", mainPassword: "" });
  };

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-6 text-secondary">
        <NavLink to="/" className="flex items-center gap-2 hover:text-blue-300">
          <ArrowLeft size={26} />
          <span>الرجوع إلي صفحة التسجيل</span>
        </NavLink>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="case_card px-15 py-12 rounded-xl shadow-lg w-full max-w-sm
                 flex flex-col gap-6 min-h-120"
        >
          <h2 className="text-2xl font-semibold text-center mb-2">
            إضافة كلمة مرور لمستخدم جديد
          </h2>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          <input
            type="password"
            name="backupPassword"
            placeholder="كلمة المرور الاحتياطية"
            value={formData.backupPassword}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3
                   focus:outline-none focus:ring"
          />

          <div className="flex items-center gap-3">
            <input
              name="mainPassword"
              type={showPassword ? "text" : "password"}
              placeholder="كلمة المرور الجديدة"
              value={formData.mainPassword}
              onChange={handleChange}
              className="flex-1 border rounded-lg px-9 py-3
                     focus:outline-none focus:ring"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`cursor-pointer p-2 rounded-lg transition ${
                showPassword ? "text-blue-300" : "text-gray-400"
              }`}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-24 w-full bg-blue-300 text-white py-3 rounded-lg
                   hover:opacity-90 text-lg"
          >
            تغيير كلمة المرور
          </button>
        </form>
      </div>
    </div>
  );
}
