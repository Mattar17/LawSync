import getMachineId from "./getMachineId.js";
import { ipcMain } from "electron";
import { appendFile } from "fs";

export default async function handleActivation(
  licensePath,
  activationWindow,
  CreateMainWindow,
) {
  ipcMain.handle("successfullActivation", async (_event, licenseData) => {
    try {
      if (!licenseData?.payload || !licenseData?.signature)
        throw new Error("invalid license");

      const { key } = licenseData.payload;
      const machineId = await getMachineId();

      const response = await fetch(
        "http://localhost:8000/api/licenses/activate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key, machineId }),
        },
      );
      const data = await response.json();
      licenseData = data.data;

      appendFile(licensePath, JSON.stringify(licenseData), (err) => {
        if (err) {
          console.error("Error writing license file:", err);
        } else {
          createMainWindow();
          if (activationWindow) activationWindow.close();
        }
      });
      return licenseData;
    } catch (err) {
      console.log(`error in this channel ${err}`);
    }
  });
}
