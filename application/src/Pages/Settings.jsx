import SetupPasswords from "./SetupPasswords";
import { ArrowLeft, FolderSync } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";

export default function Settings({ cases }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message }

  useEffect(() => {
    const savedToken = localStorage.getItem("sync_token");
    if (savedToken) setToken(savedToken);
  }, []);

  useEffect(() => {
    localStorage.setItem("sync_token", token);
  }, [token]);

  function showToast(type, message) {
    setToast({ type, message });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  async function handleSync() {
    if (!token) {
      showToast("error", "من فضلك أدخل رمز الحساب");
      return;
    }

    try {
      setLoading(true);
      const cleanedCases = cases.map((c) => {
        const { case_notes, createdAt, updatedAt, ...rest } = c;
        return rest;
      });
      console.log(cleanedCases);
      const res = await fetch(
        "https://law-sync-activation-api.vercel.app/api/sync",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ cases: cleanedCases, token }),
        },
      );

      if (!res.ok) throw new Error("Sync failed");

      const data = await res.json();
      console.log(data);

      showToast("success", "تمت المزامنة بنجاح ✅");
    } catch (err) {
      console.error(err);
      showToast("error", "حدث خطأ أثناء المزامنة ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen case_card px-6 py-6 relative">
      {/* 🔔 Toast */}
      {toast && (
        <div
          className={`absolute top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-extrabold text-2xl">الإعدادات</h1>
        <NavLink to="/cases">
          <ArrowLeft color="#f9f9f9" size={24} />
        </NavLink>
      </div>

      {/* Sync Section */}
      <div className="case_card p-6 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.4)] mb-8 w-full max-w-2xl mx-auto">
        <h2 className="text-xl mb-4 font-semibold">مزامنة البيانات</h2>

        <div className="flex flex-col gap-4">
          {/* Token */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">رمز الحساب</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="أدخل رمز الحساب"
              className="px-4 py-2 rounded-lg bg-[#2a2a2a] text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSync}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-gray-100 shadow transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90 case_card"
              }`}
            >
              <FolderSync size={18} className={loading ? "animate-spin" : ""} />
              {loading ? "جاري المزامنة..." : "مزامنة"}
            </button>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="case_card p-6 rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.4)] w-full max-w-2xl mx-auto">
        <h2 className="text-xl mb-4 font-semibold">تغيير كلمات المرور</h2>
        <ChangePassword />
      </div>
    </div>
  );
}
