import { ipcMain, shell } from "electron"
import { registerIpcLocalOllama } from "./ipcLocalOllama"
import { registerIpcSystemInfo } from "./ipcSystemInfo"

export function registerIpcHandlers() {
	// registerOllamaHandlers()
	// Add other handler registrations here
	registerIpcLocalOllama()
	registerIpcSystemInfo()

	ipcMain.on('go-to-url', (event, url) => {
		console.log(event, url)
		shell.openExternal(url)
	})

}
