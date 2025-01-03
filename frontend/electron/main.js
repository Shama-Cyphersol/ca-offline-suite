const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');




// Create logs directory
const logDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create log file stream
const logStream = fs.createWriteStream(path.join(logDir, 'main.log'), { flags: 'a' });

// Redirect console.log to file
const originalConsoleLog = console.log;
console.log = function(...args) {
  originalConsoleLog(...args);
  logStream.write(`[${new Date().toISOString()}] ${args.join(' ')}\n`);
};

// Redirect console.error to file
const originalConsoleError = console.error;
console.error = function(...args) {
  originalConsoleError(...args);
  logStream.write(`[${new Date().toISOString()}] ERROR: ${args.join(' ')}\n`);
};


function setupUpdater() {
  autoUpdater.on('checking-for-update', () => {
      log.info('Checking for updates...');
      mainWindow?.webContents.send('update-status', 'Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info);
      mainWindow?.webContents.send('update-available', {
          version: info.version,
          releaseDate: info.releaseDate
      });
  });

  autoUpdater.on('update-not-available', () => {
      log.info('Update not available');
      mainWindow?.webContents.send('update-not-available');
  });

  autoUpdater.on('download-progress', (progressObj) => {
      mainWindow?.webContents.send('download-progress', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded');
      mainWindow?.webContents.send('update-downloaded', info);
  });

  autoUpdater.on('error', (err) => {
      log.error('Update error:', err);
      mainWindow?.webContents.send('update-error', err.message);
  });
}

let pythonProcess = null;
let mainWindow = null;

function startPythonBackend() {
  const isDev = process.env.NODE_ENV === 'development';
  const isWin = process.platform === 'win32';
  const execName = isWin ? 'app.exe' : 'app';
  
  let execPath;
  if (isDev) {
    execPath = path.resolve(__dirname, '../../backend/dist', execName);
  } else {
    // For production Mac builds
    if (process.platform === 'darwin') {
      execPath = path.join(process.resourcesPath, 'backend', execName);
      
      // Double check file existence and permissions
      if (fs.existsSync(execPath)) {
        try {
          // Ensure executable has proper permissions in production
          fs.chmodSync(execPath, '755');
        } catch (error) {
          console.error('Error setting permissions:', error);
        }
      }
    } else {
      execPath = path.resolve(process.resourcesPath, 'backend', execName);
    }
  }
  
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Platform:', process.platform);
  console.log('Executable path:', execPath);
  console.log('Resources path:', process.resourcesPath);
  console.log('File exists:', fs.existsSync(execPath));
  
  if (!fs.existsSync(execPath)) {
    console.error(`Backend executable not found at: ${execPath}`);
    mainWindow?.webContents.send('backend-status', {
      status: 'error',
      message: 'Backend executable not found'
    });
    return;
  }

  // Ensure executable permissions on Unix systems
  if (!isWin) {
    try {
      fs.chmodSync(execPath, '755');
    } catch (error) {
      console.error('Error setting permissions:', error);
    }
  }

  // Handle port conflicts
  const maxRetries = 5;
  let retryCount = 0;
  let currentPort = 7500;
  
  const tryStart = () => {
    try {
      pythonProcess = spawn(execPath, ['--port', currentPort.toString()], {
        cwd: path.dirname(execPath),
        stdio: 'pipe'
      });

      console.log('Process started with PID:', pythonProcess.pid);

      pythonProcess.stdout.on('data', (data) => {
        const message = data.toString();
        console.log('Backend output:', message);
        
        if (message.includes('address already in use')) {
          if (retryCount < maxRetries) {
            retryCount++;
            currentPort = 7500 + retryCount;
            console.log(`Port conflict detected, trying port ${currentPort}...`);
            pythonProcess.kill();
            setTimeout(tryStart, 1000);
          } else {
            console.error('Failed to start backend after multiple retries');
            mainWindow?.webContents.send('backend-status', {
              status: 'error',
              message: 'Failed to start backend after multiple retries'
            });
          }
        } else if (message.includes('Application startup complete')) {
          console.log('Backend started successfully on port:', currentPort);
          mainWindow?.webContents.send('backend-status', {
            status: 'success',
            port: currentPort
          });
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error('Backend error:', data.toString());
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start backend:', error);
        mainWindow?.webContents.send('backend-status', {
          status: 'error',
          message: error.message
        });
      });

      pythonProcess.on('close', (code) => {
        console.log('Backend process closed with code:', code);
      });

    } catch (error) {
      console.error('Error launching backend:', error);
      mainWindow?.webContents.send('backend-status', {
        status: 'error',
        message: error.message
      });
    }
  };

  tryStart();
  
  ipcMain.handle('getBackendPort', () => {
    return currentPort;
  });

  ipcMain.handle('check-for-updates', () => {
    autoUpdater.checkForUpdates();
  });
  
  ipcMain.handle('download-update', () => {
    autoUpdater.downloadUpdate();
  });
  
  ipcMain.handle('install-update', () => {
    autoUpdater.quitAndInstall();
  });
}

function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
    console.log('Backend stopped');
  }
}

const isDev = process.env.NODE_ENV === 'development';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

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
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1000,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, './assets/cyphersol-icon.png'),
    autoHideMenuBar: true,
    title: 'CypherSol',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    const prodPath = path.resolve(__dirname, '..', 'react-app', 'build', 'index.html');
    console.log('Production path:', prodPath);
    mainWindow.loadFile(prodPath).catch(err => {
      console.error('Failed to load production build:', err);
    });
  }

  if (isDev) {
    // mainWindow.webContents.openDevTools();
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

app.whenReady().then(() => {
  createProtocol();
  createWindow();
  startPythonBackend();
  setupUpdater();  // Add this
  autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
  stopPythonBackend();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});