const { app, BrowserWindow, protocol, ipcMain, shell } = require("electron");
const { registerOpenFileIpc } = require("./ipc/fileHandler");
require("dotenv").config();
const path = require("path");
const { setupTransactionIPC } = require("./ipc/individualDashboard");

console.log("Working Directory:", process.cwd());

const log = require("electron-log");
// const database = require('./db/db');
// const UserRepository = require('./db/repository/UserRepository');

// Configure electron-log
log.transports.console.level = "debug"; // Set the log level
log.transports.file.level = "info"; // Only log info level and above in the log file

// Instead of electron-is-dev, we'll use this simple check
const isDev = process.env.NODE_ENV === "development";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const BASE_DIR = isDev ? __dirname : process.resourcesPath;

// Add this function to handle file protocol
function createProtocol() {
  protocol.registerFileProtocol("app", (request, callback) => {
    const url = request.url.replace("app://", "");
    try {
      return callback(path.normalize(`${__dirname}/../react-app/build/${url}`));
    } catch (error) {
      console.error("Protocol error:", error);
    }
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 1000,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "./assets/cyphersol-icon.png"),
    autoHideMenuBar: true,
    title: isDev ? "CypherSol Dev" : "CypherSol",
  });

  setupTransactionIPC();

  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    // Use absolute path resolution for production
    const prodPath = path.resolve(
      __dirname,
      "react-app",
      "build",
      "index.html"
    );
    log.info("Directory name:", __dirname);
    console.log("Production path:", prodPath);
    log.info("Production path:", prodPath);
    win.loadFile(prodPath).catch((err) => {
      console.error("Failed to load production build:", err);
    });
  }

  try {
    await initializeTransactions();
  } catch (error) {
    log.error("Failed to initialize transactions:", error);
  }

  if (isDev) {
    // win.webContents.openDevTools();
  }

  registerOpenFileIpc(BASE_DIR);
}

function createUser() {
  try {
    const userData = {
      username: "john_doe",
      email: "john.doe@example.com",
      password: "securepassword", // Adjust this according to your hashing mechanism
    };

    const newUser = UserRepository.createUser(userData);
    console.log("User created successfully:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

app.whenReady().then(() => {
  createProtocol();
  createWindow();

  try {
    createUser();
  } catch (dbError) {
    console.error("User creation error:", dbError);
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
