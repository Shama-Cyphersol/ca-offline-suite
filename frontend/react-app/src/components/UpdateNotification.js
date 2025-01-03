import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

function UpdateNotification() {
    const [updateStatus, setUpdateStatus] = useState(null);
    const [downloadProgress, setDownloadProgress] = useState(0);

    useEffect(() => {
        // Listen for update events
        ipcRenderer.on('update-available', (_, info) => {
            setUpdateStatus({ type: 'available', info });
        });

        ipcRenderer.on('download-progress', (_, progressObj) => {
            setDownloadProgress(progressObj.percent);
        });

        ipcRenderer.on('update-downloaded', () => {
            setUpdateStatus({ type: 'ready' });
        });

        ipcRenderer.on('update-error', (_, error) => {
            setUpdateStatus({ type: 'error', error });
        });

        // Check for updates periodically (every 30 minutes)
        const checkInterval = setInterval(() => {
            ipcRenderer.invoke('check-for-updates');
        }, 1800000);

        // Cleanup listeners
        return () => {
            clearInterval(checkInterval);
            ipcRenderer.removeAllListeners('update-available');
            ipcRenderer.removeAllListeners('download-progress');
            ipcRenderer.removeAllListeners('update-downloaded');
            ipcRenderer.removeAllListeners('update-error');
        };
    }, []);

    const handleDownload = () => {
        ipcRenderer.invoke('download-update');
    };

    const handleInstall = () => {
        ipcRenderer.invoke('install-update');
    };

    if (!updateStatus) return null;

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
            {updateStatus.type === 'available' && (
                <div>
                    <h3 className="text-lg font-semibold">Update Available!</h3>
                    <p className="text-sm text-gray-600">Version {updateStatus.info.version}</p>
                    <button 
                        onClick={handleDownload}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Download Update
                    </button>
                </div>
            )}

            {downloadProgress > 0 && downloadProgress < 100 && (
                <div>
                    <h3 className="text-lg font-semibold">Downloading Update...</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${downloadProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600">{Math.round(downloadProgress)}%</p>
                </div>
            )}

            {updateStatus.type === 'ready' && (
                <div>
                    <h3 className="text-lg font-semibold">Update Ready!</h3>
                    <p className="text-sm text-gray-600">Restart to install the update</p>
                    <button 
                        onClick={handleInstall}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Restart & Install
                    </button>
                </div>
            )}

            {updateStatus.type === 'error' && (
                <div>
                    <h3 className="text-lg font-semibold text-red-500">Update Error</h3>
                    <p className="text-sm text-gray-600">{updateStatus.error}</p>
                </div>
            )}
        </div>
    );
}

export default UpdateNotification;