import getMachineId from "./getMachineId.js";
import { ipcMain } from "electron";
import { writeFile } from "fs";

export default async function handleActivation(
  licensePath,
  activationWindow,
  CreateMainWindow,
) {
  ipcMain.handle("successfullActivation", async (_event, licenseData) => {
    try {
      console.log("Activation channel is Working...");
      console.log(licenseData);
      if (!licenseData) throw new Error("invalid license");

      const { key } = licenseData;
      const machineId = await getMachineId();

      const response = await fetch(
        "https://law-sync-activation-api.vercel.app/api/licenses/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.API_KEY,
          },
          body: JSON.stringify({ key, machineId }),
        },
      );
      const data = await response.json();
      licenseData = data.data;

      writeFile(licensePath, JSON.stringify(licenseData), (err) => {
        if (err) {
          console.error("Error writing license file:", err);
        } else {
          CreateMainWindow();
          const win = activationWindow();
          if (win) win.close();
        }
      });
      return licenseData;
    } catch (err) {
      console.log(`error in this channel ${err}`);
    }
  });
}
