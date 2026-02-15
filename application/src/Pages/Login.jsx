import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Eye, EyeClosed } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (import.meta.env.PROD) {

  //     navigate("/activation");
  //   }
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "passwords wasn't found")
          navigate("/setup-passwords");
        else if (data.status === "success") {
          navigate("/cases");
        } else {
          setError("كلمة المرور غير صحيحة");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="case_card p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <img src="LawSync_Logo.png"></img>

        <div className="flex justify-between p-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring"
          />
          <button
            type="button"
            className={`pr-2 ${showPassword && "text-blue-300"}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="pb-6 pr-2">
          <NavLink className="text-blue-300" to="/forget_password">
            نسيت كلمة المرور ؟
          </NavLink>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-300 text-white py-2 rounded hover:opacity-90 transition cursor-pointer"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
