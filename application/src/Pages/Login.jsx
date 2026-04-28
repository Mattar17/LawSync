import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Eye, EyeClosed, X } from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // RESET MODAL STATES
  const [showReset, setShowReset] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "passwords wasn't found")
          navigate("/setup_passwords");
        else if (data.status === "success") navigate("/cases");
        else setError("كلمة المرور غير صحيحة");
      });
  };

  // RESET PASSWORD HANDLER
  const handleReset = async () => {
    setResetLoading(true);
    setResetError("");

    try {
      const res = await fetch(`${VITE_API_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResetError(data.message || "Reset failed");
        return;
      }

      alert("Password collection reset successfully");
      setShowReset(false);
      setConfirmPassword("");
    } catch (err) {
      setResetError("Server error");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative">
      {/* RESET BUTTON (TOP RIGHT) */}
      <button
        onClick={() => setShowReset(true)}
        className="absolute top-4 right-4 text-red-500 font-semibold hover:opacity-70"
      >
        Reset
      </button>

      {/* LOGIN FORM */}
      <form
        onSubmit={handleSubmit}
        className="case_card p-6 rounded-lg shadow-[0px_1px_4px_rgba(222,222,222,0.6)] w-full max-w-sm"
      >
        <img src="LawSync_Logo.png" />

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

      {/* RESET MODAL OVERLAY */}
      {showReset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          {/* CARD (same style vibe as login) */}
          <div className="case_card bg-[#0f0f0f] text-white p-6 rounded-lg shadow-[0px_1px_10px_rgba(0,0,0,0.6)] w-full max-w-sm relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowReset(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">
              Reset Password System
            </h2>

            <p className="text-xs text-gray-400 mb-4 text-center">
              Enter confirmation password to reset system data
            </p>

            <input
              type="password"
              placeholder="Confirm reset password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded px-3 py-2 mb-3 
                   focus:outline-none focus:ring-1 focus:ring-red-400"
            />

            {resetError && (
              <p className="text-red-400 text-sm mb-2 text-center">
                {resetError}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={resetLoading}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded font-medium"
            >
              {resetLoading ? "Resetting..." : "Confirm Reset"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
