import { ipcMain } from "electron";
import getMachineId from "./getMachineId.js";
import { writeFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();
//"https://law-sync-activation-api.vercel.app/api/licenses/trial/start"
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
    if (!data.success) {
      return "expired";
    }
    if (data.success) {
      const licenseData = JSON.stringify(data.data);
      writeFileSync(licensePath, licenseData);
      createMainWindow();
      const win = getActivationWindow();
      if (win) win.close();
      return "Trial started successfully";
    }
  });
}
