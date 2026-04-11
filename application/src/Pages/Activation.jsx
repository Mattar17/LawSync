import { useEffect, useState } from "react";
import { ClipLoader, PulseLoader } from "react-spinners";

export default function Activation() {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrialLoading, setIsTrialLoading] = useState(false);

  const messageTextColor = error ? "text-red-600" : "text-green-600";

  const handleActivate = async () => {
    console.log("handleActivate started....");
    setIsLoading(true);
    let controller = new AbortController();

    setTimeout(() => controller.abort(), 3000);

    try {
      let response = await fetch(
        "https://law-sync-activation-api.vercel.app/api/licenses/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ key }),
          signal: controller.signal,
        },
      );
      const data = await response.json();
      console.log("Activation API response:", data);
      if (data.success) {
        setError(false);
        setMessage("تم تفعيل البرنامج بنجاح ✅");
        await window.activation.activate(data.data);
      } else setMessage("مفتاح تفعيل غير صالح ❌");
    } catch (err) {
      if (err.name === "AbortError") setMessage("Timeout Error");
      else setMessage("Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  const startTrial = async () => {
    setIsTrialLoading(true);
    const result = await window.activation.startTrial();
    if (result === "expired") {
      setMessage("لقد تم استخدام النسخة التجريبية مسبقًا على هذا الجهاز");
      setIsTrialLoading(false);
    } else if (result === "Trial started successfully") {
      setError(false);
      setMessage("تم تفعيل النسخة التجريبية بنجاح ✅");
      setIsTrialLoading(false);
    } else {
      setMessage("حدث خطأ أثناء تفعيل النسخة التجريبية ❌");
      setIsTrialLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="w-[420px] rounded-2xl bg-slate-950 p-8 shadow-2xl text-center">
        <h1 id="message" className="text-xl font-semibold text-slate-100">
          تفعيل البرنامج
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          أدخل مفتاح التفعيل الخاص بك أو قم بتفعيل النسخة التجريبية المجانية
        </p>

        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mt-6 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
        {message !== "" && (
          <p className={`pt-1 ${messageTextColor}`}>{message}</p>
        )}
        <button
          onClick={handleActivate}
          className="cursor-pointer mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "تفعيل البرنامج"
          )}
        </button>

        <div className="mt-6 flex flex-col gap-2">
          <span className="text-xs text-slate-400">ليس لديك مفتاح تفعيل؟</span>
          <button
            onClick={startTrial}
            className="cursor-pointer text-sm text-sky-400 hover:text-sky-300 transition"
          >
            {isTrialLoading ? (
              <PulseLoader color="#38BDF8" size={12} />
            ) : (
              "تفعيل النسخة التجريبية المجانية"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
