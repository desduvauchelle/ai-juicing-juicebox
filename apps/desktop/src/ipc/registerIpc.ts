import { registerIpcLocalOllama } from "./ipcLocalOllama"
import { registerIpcSystemInfo } from "./ipcSystemInfo"
import { registerIpcGeneralSettings } from "./ipcDataGeneralSettings" // Import the new function

export function registerIpcHandlers() {
	// registerOllamaHandlers()
	// Add other handler registrations here
	registerIpcLocalOllama()
	registerIpcSystemInfo()
	registerIpcGeneralSettings() // Register general settings IPC handlers
}
