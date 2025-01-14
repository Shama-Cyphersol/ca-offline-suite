const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API for opening files to the renderer process
contextBridge.exposeInMainWorld('electron', {
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
});
