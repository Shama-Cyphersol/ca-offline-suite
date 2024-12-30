const { app, BrowserWindow } = require('electron');
const path = require('path');

// Add a default value and ensure only valid environments are used
const NODE_ENV = process.env.NODE_ENV || 'production'; // Fallback to production if not set
const isDev = NODE_ENV === 'development';

// Validate environment
if (NODE_ENV !== 'development' && NODE_ENV !== 'production') {
    console.warn(`Warning: Invalid NODE_ENV "${NODE_ENV}". Defaulting to production.`);
}

console.log('Current Environment:', NODE_ENV);
console.log('Is Development Mode:', isDev);

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

    // Load the React app
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../react-app/build/index.html')}`
    );

    if (isDev) {

        // win.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

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
