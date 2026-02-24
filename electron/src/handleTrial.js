import { ipcMain } from "electron";
import getMachineId from "./getMachineId.js";
import { appendFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

export default async function handleTrialCreation(
  licensePath,
  getActivationWindow,
  createMainWindow,
) {
  const machineId = await getMachineId();
  ipcMain.handle("startTrial", async () => {
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
    const data = await res.json();
    if (res.status === 206) return "Trial already used on this machine";
    if (data.success) {
      const licenseData = JSON.stringify(data.data);
      appendFileSync(licensePath, licenseData);
      createMainWindow();
      const win = getActivationWindow();
      if (win) win.close();
    }
  });
}
