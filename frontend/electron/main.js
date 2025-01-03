const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');

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
let pythonProcess = null;

function startPythonBackend() {
  const options = {
    mode: 'text',
    pythonPath: isDev ? (process.env.PYTHON_PATH || 'python3') : path.join(process.resourcesPath, 'env', 'bin', 'python3'),
    scriptPath: isDev ? path.join(__dirname, '../../backend') : path.join(process.resourcesPath, 'backend'),
    args: ['--port', '7500']
  };

  // Handle port conflicts
  const maxRetries = 5;
  let retryCount = 0;
  
  const tryStart = () => {
    pythonProcess = new PythonShell('app.py', options);
    
    pythonProcess.on('message', (message) => {
      console.log('Python Output:', message);
      if (message.includes('address already in use')) {
        if (retryCount < maxRetries) {
          retryCount++;
          options.args[1] = String(5000 + retryCount);
          console.log(`Port conflict detected, trying port ${options.args[1]}...`);
          tryStart();

          
        } else {
          console.error('Failed to start Python backend after multiple retries');
          // Notify renderer process of backend failure
          mainWindow?.webContents.send('backend-status', {
            status: 'error',
            message: 'Failed to start backend after multiple retries'
          });
        }
      } else if (message.includes('Application startup complete')) {
        // Notify renderer process of successful backend start
        mainWindow?.webContents.send('backend-status', {
          status: 'success',
          port: options.args[1]
        });
      }
    });

    pythonProcess.on('stderr', (error) => {
      console.error('Python Error:', error);
    });

    pythonProcess.on('close', () => {
      console.log('Python process closed');
    });
  };

  tryStart();
  
  // Expose backend port to renderer process
  ipcMain.handle('getBackendPort', () => {
    return options.args[1];
  });

  pythonProcess.on('message', (message) => {
    console.log('Python:', message);
  });

  pythonProcess.on('stderr', (error) => {
    console.error('Python Error:', error);
  });

  pythonProcess.on('close', () => {
    console.log('Python process closed');
  });
}

function stopPythonBackend() {
  if (pythonProcess) {
    pythonProcess.end(() => {
      console.log('Python backend stopped');
    });
  }
}

// Instead of electron-is-dev, we'll use this simple check
const isDev = process.env.NODE_ENV === 'development' 
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

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
            contextIsolation: false
        },
        icon: path.join(__dirname, './assets/cyphersol-icon.png'),
        autoHideMenuBar: true,
        title: 'CypherSol',
    });

    if (isDev) {
        win.loadURL('http://localhost:3000');
    } else {
        // Use absolute path resolution for production
        const prodPath = path.resolve(__dirname, '..', 'react-app', 'build', 'index.html');
        console.log('Production path:', prodPath);
        win.loadFile(prodPath).catch(err => {
            console.error('Failed to load production build:', err);
        });
    }

    if (isDev) {
        // win.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
  createProtocol();
  startPythonBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopPythonBackend();
    app.quit();
  }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
