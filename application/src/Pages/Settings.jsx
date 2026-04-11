import SetupPasswords from "./SetupPasswords";
import { ArrowLeft, FolderSync } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Settings({ cases }) {
  function handleSync() {
    async function syncData() {
      const res = await fetch("http://localhost:8000/api/cases/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ cases }),
      });
      const data = await res.json();
      console.log(data);
    }
    console.log("Syncing data...");
    syncData();
  }

  return (
    <div className="h-screen case_card overflow-hidden">
      <div className="flex justify-end py-4 px-6">
        <NavLink to="/cases">
          <ArrowLeft color="#f9f9f9" size={24}></ArrowLeft>
        </NavLink>
      </div>
      <div className="flex flex-col items-center gap-9 px-12 py-6">
        <h1 className="text-center font-extrabold text-2xl">الإعدادات</h1>
        <div className="flex items-center gap-32">
          <h1 className="text-xl">مزامنة البيانات</h1>
          <button
            onClick={handleSync}
            className="cursor-pointer px-6 py-1 case_card shadow-[0_0_10px_0_rgba(0,0,0,0.5)] text-gray-100 rounded-lg hover:opacity-90"
          >
            <FolderSync
              className="inline-block hover:text-blue-300"
              size={18}
            />
          </button>
        </div>
        <hr className="my-3 border-[#6a6a6a66]" />
        <SetupPasswords />
      </div>
    </div>
  );
}
