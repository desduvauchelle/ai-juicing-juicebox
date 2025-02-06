import { ipcMain } from 'electron'
import { GeneralService } from '../services/generalService'

// Export a function to register general settings IPC handlers.
export function registerIpcGeneralSettings() {
	// ...existing code...
	ipcMain.handle('general-settings-get', async () => {
		return await GeneralService.get()
	})

	ipcMain.handle('general-settings-save', async (event, settings) => {
		await GeneralService.save(settings)
	})

	ipcMain.handle('general-settings-clear', async () => {
		await GeneralService.clear()
	})
}
