const { contextBridge, ipcRenderer } = require('electron');
const { execSync } = require('child_process');

// Expose a limited subset of Node.js functionality to the renderer process
contextBridge.exposeInMainWorld('electron', {
	send: (channel, data) => {
		ipcRenderer.send(channel, data);
	},
	receive: (channel, func) => {
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
	checkOllamaInstalled: () => {
		try {
			execSync('ollama --version', { stdio: 'ignore' });
			return true;
		} catch {
			return false;
		}
	}
});
