import { useEffect, useState } from "react";

export default function Activation() {
  const [key, setKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(true);

  const messageTextColor = error ? "text-red-600" : "text-green-600";

  const handleActivate = async () => {
    let controller = new AbortController();

    setTimeout(() => controller.abort(), 3000);

    try {
      let response = await fetch(
        "http://localhost:8000/api/licenses/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: import.meta.env.VITE_API_KEY,
          },
          body: JSON.stringify({ key }),
          signal: controller.signal,
        },
      );
      const data = await response.json();
      if (data.success === "true") {
        setError(false);
        setMessage("Successful Validation ✔");
        await window.activation.activate(data.data);
      } else setMessage("Key is Invalid ⚠");
    } catch (err) {
      if (err.name === "AbortError") setMessage("Timeout Error");
      else setMessage("Server Error");
    }
  };

  const startTrial = async () => {
    console.log("Start trial");
    await window.activation.startTrial();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="w-[420px] rounded-2xl bg-slate-950 p-8 shadow-2xl text-center">
        <h1 id="message" className="text-xl font-semibold text-slate-100">
          Activate Your License
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your activation key to unlock the full version
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
          Activate
        </button>

        <div className="mt-6 flex flex-col gap-2">
          <span className="text-xs text-slate-400">Don’t have a key?</span>
          <button
            onClick={startTrial}
            className="cursor-pointer text-sm text-sky-400 hover:text-sky-300 transition"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
}
