const path = require('path');
const { ipcMain, shell } = require('electron');
const log = require('electron-log');
const db = require('../db/db');
const { users } = require('../db/schema/User');
// console.log("Users : ", users)

async function registerOpenFileIpc(BASE_DIR) {

    console.log("Registering open-file IPC handler");
    console.log("Trying Db connection");
    try{
        const result = await db.select().from(users);
        console.log("Users: ", result);
    }
    catch(e){
        console.log("DB connection failed");
        console.log(e);
    }

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
