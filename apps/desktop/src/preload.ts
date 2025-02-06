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
	ollamaModelRemote: () => ipcRenderer.invoke('ollama-model-remote')
}

// Expose the API through contextBridge
contextBridge.exposeInMainWorld('electron', {
	...electronAPI,
	test: () => 'test'
})
