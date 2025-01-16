const path = require('path');
const { ipcMain, shell } = require('electron');
const log = require('electron-log');

function registerOpenFileIpc(BASE_DIR) {

    console.log("Registering open-file IPC handler");

    ipcMain.handle('open-file', async (event, filePath) => {
        try {
            const systemFilePath = path.join(BASE_DIR, 'media', 'vouchers', filePath);
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

module.exports = { registerOpenFileIpc };
