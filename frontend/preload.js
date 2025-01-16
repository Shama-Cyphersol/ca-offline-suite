const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API for opening files to the renderer process
contextBridge.exposeInMainWorld('electron', {
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),

  user: {
    getData: (userId) => ipcRenderer.invoke('user:get-data', userId),
    updateData: (userData) => ipcRenderer.send('user:update-data', userData),
  },

  file: {
    open: (filePath) => ipcRenderer.send('file:open', filePath),
    save: (fileContent) => ipcRenderer.invoke('file:save', fileContent),
    getData: (filePath) => ipcRenderer.invoke('file:get-data', filePath),
  },
});
