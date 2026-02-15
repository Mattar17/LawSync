import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
import { mkdirSync, existsSync, appendFileSync, readFileSync } from "fs";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import validateLicense from "./validateLicense.js";
import handleActivation from "./src/handleActivation.js";
import handleTrial from "./src/handleTrial.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = app.isPackaged;
const resourcesPath = process.resourcesPath;

function log(msg) {
  const logPath = path.join(app.getPath("userData"), "lawsync.log");
  appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
}

const licensePath = path.join(app.getPath("userData"), "license.json");

let activationWindow = null;

function CreateActivationWindow() {
  activationWindow = new BrowserWindow({
    width: 520,
    height: 620,
    minWidth: 480,
    minHeight: 580,
    resizable: false,
    maximizable: false,
    minimizable: true,
    center: true,
    title: "Activate LawSync",
    backgroundColor: "#0f172a",

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  activationWindow.loadFile(
    path.join(__dirname, "../application/dist/index.html"),
    {
      hash: "activation",
    },
  );

  activationWindow.on("close", (e) => {
    activationWindow = null;
  });

  return activationWindow;
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const uiPath = isProd
    ? path.join(app.getAppPath(), "application", "dist", "index.html")
    : path.join(__dirname, "../application/dist/index.html");
  log("[UI path]" + uiPath);
  win.loadFile(uiPath);
  win.maximize();
}
async function checkLicense() {
  if (!existsSync(licensePath)) return false;
  const licenseRaw = readFileSync(licensePath);
  const license = JSON.parse(licenseRaw);
  const isValid = await validateLicense(license.payload, license.signature);
  if (!isValid) {
    console.log("Not Valid License!!!!!!!!!!!💢💥🛑");
    return false;
  } else {
    console.log("Valid All Good 💫✅♻");
    return true;
  }
}
handleActivation(licensePath, CreateActivationWindow, createMainWindow);
handleTrial(licensePath, () => activationWindow, createMainWindow);

let mongoProcess;
let apiProcess;

function startMongo() {
  const mongoPath = isProd
    ? path.join(resourcesPath, "bin", "mongo", "mongod.exe")
    : path.join(__dirname, "bin", "mongo", "mongod.exe");

  const dbPath = path.join(app.getPath("userData"), "db");

  log("Starting MongoDB");
  log("Mongo path: " + mongoPath);
  log("DB path: " + dbPath);

  if (!existsSync(dbPath)) {
    mkdirSync(dbPath, { recursive: true });
  }

  mongoProcess = spawn(mongoPath, [
    "--dbpath",
    dbPath,
    "--port",
    "27017",
    "--bind_ip",
    "127.0.0.1",
    "--quiet",
  ]);

  mongoProcess.on("error", (err) => log("Mongo error: " + err.message));
  mongoProcess.stderr.on("data", (d) => log("Mongo stderr: " + d.toString()));
}

function waitForMongo(port = 27017, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const socket = new net.Socket();
      socket.setTimeout(500);

      socket
        .on("connect", () => {
          clearInterval(interval);
          socket.destroy();
          resolve();
        })
        .on("error", () => socket.destroy())
        .on("timeout", () => socket.destroy())
        .connect(port, host);
    }, 300);
  });
}

async function startApi() {
  log("Waiting for MongoDB...");
  await waitForMongo();
  log("MongoDB is ready");

  const apiPath = isProd
    ? path.join(resourcesPath, "server", "server.exe")
    : path.join(__dirname, "../server/index.js");

  log("API path: " + apiPath);

  apiProcess = isProd
    ? spawn(apiPath, [], {
        stdio: "pipe",
      })
    : spawn("node", [apiPath], {
        stdio: "pipe",
      });

  apiProcess.stdout.on("data", (d) => log("[API] " + d.toString()));
  apiProcess.stderr.on("data", (d) => log("[API ERROR] " + d.toString()));

  apiProcess.on("close", (code) => log(`API exited with code ${code}`));

  apiProcess.on("error", (err) => log("API spawn error: " + err.message));

  log("API started successfully");
}

autoUpdater.on("update-available", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update Available",
    message: "تحديث: إضافة كلمة مرور لمستخدم جديد, برجاء عدم إغلاق النافذة",
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "تم تحميل التحديث, إضغط لإعادة تشغيل البرنامج",
      buttons: ["Restart"],
    })
    .then(() => {
      autoUpdater.quitAndInstall();
    });
});

app.whenReady().then(async () => {
  const activated = await checkLicense();

  if (activated) {
    startMongo();
    await startApi();
    createMainWindow();
  } else {
    CreateActivationWindow();
  }

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("before-quit", () => {
  if (apiProcess) apiProcess.kill();
  if (mongoProcess) mongoProcess.kill();
});
