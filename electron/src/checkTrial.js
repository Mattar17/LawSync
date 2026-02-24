import { ipcMain } from "electron";
import getMachineId from "./getMachineId.js";

export default function checkTrial() {
  ipcMain.handle("checkTrial", async () => {
    const machineId = await getMachineId();
    const res = await fetch(
      "https://law-sync-activation-api.vercel.app/api/licenses/trial/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY,
        },
        body: JSON.stringify({ machineId }),
      },
    );

    const resData = await res.json();
    console.log("Trial check response:", resData);
    if (resData.data) {
      const data = resData.data;
      return data;
    } else return null;
  });
}
