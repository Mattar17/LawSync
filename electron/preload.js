const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("activation", {
  activate: (licenseData) =>
    ipcRenderer.invoke("successfullActivation", licenseData),
  startTrial: () => ipcRenderer.invoke("startTrial"),
  checkTrial: () => ipcRenderer.invoke("checkTrial"),
});
