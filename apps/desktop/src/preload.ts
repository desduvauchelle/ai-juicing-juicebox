// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('electron', {
	ollamaInstallCheck: () => ipcRenderer.invoke('ollama-install-check'),
	ollamaServerToggle: (start: boolean) => ipcRenderer.invoke('ollama-server-toggle', start),
	ollamaModelDownload: (modelId: string) => ipcRenderer.invoke('ollama-model-download', modelId),
	ollamaModelRemove: (modelId: string) => ipcRenderer.invoke('ollama-model-remove', modelId),
	systemInfoGet: () => ipcRenderer.invoke('system-info-get'),
	ollamaModelRemote: () => ipcRenderer.invoke('ollama-model-remote'),
	checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
	quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
	onUpdateStatus: (callback: any) => {
		ipcRenderer.on('update-status', (_, status, info) => callback(status, info))
	}
})
