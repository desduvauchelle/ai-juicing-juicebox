import { registerIpcLocalOllama } from "./ipcLocalOllama"
import { registerIpcSystemInfo } from "./ipcSystemInfo"

export function registerIpcHandlers() {
	// registerOllamaHandlers()
	// Add other handler registrations here
	registerIpcLocalOllama()
	registerIpcSystemInfo()
}
