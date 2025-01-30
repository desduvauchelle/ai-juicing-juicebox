const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	ollamaInstallCheck: () => ipcRenderer.invoke('ollama-install-check'),
	ollamaServerToggle: (start) => ipcRenderer.invoke('ollama-server-toggle', start),
	ollamaModelDownload: (modelId) => ipcRenderer.invoke('ollama-model-download', modelId),
	ollamaModelRemove: (modelId) => ipcRenderer.invoke('ollama-model-remove', modelId),
	systemInfoGet: () => ipcRenderer.invoke('system-info-get'),
	ollamaModelRemote: () => ipcRenderer.invoke('ollama-model-remote'),

	// Add these new methods
	checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
	quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
	onUpdateStatus: (callback) => {
		ipcRenderer.on('update-status', (_, status, info) => callback(status, info));
	}
});
