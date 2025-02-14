import { ipcMain, shell } from "electron"
import { registerIpcLocalOllama } from "./ipcLocalOllama"
import { registerIpcSystemInfo } from "./ipcSystemInfo"
import { registerIpcUrlScrape } from "./ipcUrlScrape"

export function registerIpcHandlers() {
	registerIpcLocalOllama()
	registerIpcSystemInfo()
	registerIpcUrlScrape()

	ipcMain.on('go-to-url', (event, url) => {
		shell.openExternal(url)
	})

}
