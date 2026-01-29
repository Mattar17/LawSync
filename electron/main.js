import { app, BrowserWindow, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import net from "net";
import { mkdirSync, existsSync, appendFileSync } from "fs";
import pkg from "electron-updater";
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = app.isPackaged;
const resourcesPath = process.resourcesPath;

function log(msg) {
  const logPath = path.join(app.getPath("userData"), "lawsync.log");
  appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);
}

function createWindow() {
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

const filesStoragePath = isProd
  ? path.join(app.getPath("userData"), "cases_files")
  : path.join(__dirname, "cases_files");

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
        env: {
          ...process.env,
          CASES_ROOT: filesStoragePath,
        },
        stdio: "pipe",
      })
    : spawn("node", [apiPath], {
        env: {
          ...process.env,
          CASES_ROOT: filesStoragePath,
        },
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
    message: "A new version is downloading...",
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update Ready",
      message: "Update downloaded. App will restart.",
      buttons: ["Restart"],
    })
    .then(() => {
      autoUpdater.quitAndInstall();
    });
});

app.whenReady().then(async () => {
  startMongo();
  await startApi();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("before-quit", () => {
  if (apiProcess) apiProcess.kill();
  if (mongoProcess) mongoProcess.kill();
});
