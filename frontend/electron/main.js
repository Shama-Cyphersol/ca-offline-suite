const { app, BrowserWindow } = require('electron');
const path = require('path');

// Instead of electron-is-dev, we'll use this simple check
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined;

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
            : `file://${path.join(__dirname, '../frontend/build/index.html')}`
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