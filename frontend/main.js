const { app, BrowserWindow, protocol, ipcMain, shell } = require('electron');
require('dotenv').config();
const path = require('path');
console.log('Working Directory:', process.cwd());

const log = require('electron-log');
// const database = require('./db/db');
// const UserRepository = require('./db/repository/UserRepository');

// Configure electron-log
log.transports.console.level = 'debug'; // Set the log level
log.transports.file.level = 'info'; // Only log info level and above in the log file


// Instead of electron-is-dev, we'll use this simple check
const isDev = process.env.NODE_ENV === 'development'
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const BASE_DIR = isDev ? __dirname : process.resourcesPath;

// Add this function to handle file protocol
function createProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.replace('app://', '');
    try {
      return callback(path.normalize(`${__dirname}/../react-app/build/${url}`));
    } catch (error) {
      console.error('Protocol error:', error);
    }
  });
}


function createWindow() {
  const win = new BrowserWindow({
    width: 1800,
    height: 1000,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      // contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, './assets/cyphersol-icon.png'),
    autoHideMenuBar: true,
    title: isDev? 'CypherSol Dev' : 'CypherSol',

  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    // Use absolute path resolution for production
    const prodPath = path.resolve(__dirname, '..', 'react-app', 'build', 'index.html');
    log.info("Directory name:", __dirname);
    console.log('Production path:', prodPath);
    log.info('Production path:', prodPath);
    win.loadFile(prodPath).catch(err => {
      console.error('Failed to load production build:', err);
    });
  }

  if (isDev) {
    // win.webContents.openDevTools();
  }

  // Register the IPC event for opening a file path
  ipcMain.handle('open-file', async (event, filePath) => {
    try {
      systemFilePath = path.join(BASE_DIR, "media", "vouchers", filePath);
      console.log('Opening file:', systemFilePath);
      log.info('Opening file:', systemFilePath);
      const result = await shell.openPath(systemFilePath);
      if (result) {
        throw new Error(`Error opening file: ${result}`);
      }
      log.info('File opened successfully');
      return 'File opened successfully';
    } catch (error) {
      log.error('Error opening file:', error);
      return { error: error.message };
    }
  });
}

function createUser() {
  try {
    const userData = {
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'securepassword', // Adjust this according to your hashing mechanism
    };

    const newUser = UserRepository.createUser(userData);
    console.log('User created successfully:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

app.whenReady().then(() => {
  createProtocol();
  createWindow();

  try {
    createUser();
  } catch (dbError) {
    console.error('User creation error:', dbError);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
