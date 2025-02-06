// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI } from 'types/Electron'


const electronAPI: ElectronAPI = {
	ollamaInstallCheck: () => ipcRenderer.invoke('ollama-install-check'),
	ollamaServerToggle: (start: boolean) => ipcRenderer.invoke('ollama-server-toggle', start),
	ollamaModelDownload: (modelId: string) => ipcRenderer.invoke('ollama-model-download', modelId),
	ollamaModelRemove: (modelId: string) => ipcRenderer.invoke('ollama-model-remove', modelId),
	systemInfoGet: () => ipcRenderer.invoke('system-info-get'),
	ollamaModelRemote: () => ipcRenderer.invoke('ollama-model-remote'),
	// checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
	// quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),
	// onUpdateStatus: (callback: any) => {
	// 	ipcRenderer.on('update-status', (_, status, info) => callback(status, info))
	// },
	// Expose methods for general settings IPC
	generalSettingsGet: () => ipcRenderer.invoke('general-settings-get'),
	generalSettingsSave: (settings: any) => ipcRenderer.invoke('general-settings-save', settings),
	generalSettingsClear: () => ipcRenderer.invoke('general-settings-clear')
}

contextBridge.exposeInMainWorld('electron', electronAPI)
