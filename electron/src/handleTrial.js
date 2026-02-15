import { ipcMain } from "electron";
import getMachineId from "./getMachineId.js";
import { appendFileSync } from "fs";

export default async function handleTrialCreation(
  licensePath,
  getActivationWindow,
  createMainWindow,
) {
  const machineId = await getMachineId();
  ipcMain.handle("startTrial", async () => {
    const res = await fetch("http://localhost:8000/api/licenses/trial/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ machineId }),
    });
    const data = await res.json();
    console.log("data from trial api=>", data);
    if (data.success === "false") return;
    if (data.success === "true") {
      console.log("machine doesn't exist and now creating license.json");
      const licenseData = JSON.stringify(data.data);
      console.log("licenseData=>", licenseData);
      appendFileSync(licensePath, licenseData);
      createMainWindow();
      const win = getActivationWindow();
      if (win) win.close();
    }
  });
}
