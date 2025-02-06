import { ipcMain } from "electron"
import { execSync, spawn } from 'child_process'


let ollamaProcess: ReturnType<typeof spawn> | null = null


export const registerIpcLocalOllama = () => {

	// Register IPC handlers
	ipcMain.handle('ollama-install-check', () => {
		try {
			execSync('ollama --version', { stdio: 'ignore' })
			return true
		} catch {
			return false
		}
	})

	ipcMain.handle('ollama-server-toggle', async (_, start) => {
		try {
			if (start) {
				if (!ollamaProcess) {
					ollamaProcess = spawn('ollama', ['serve'], {
						detached: false,
						stdio: 'pipe'
					})

					ollamaProcess.on('error', (error) => {
						console.error('Failed to start ollama:', error)
						ollamaProcess = null
					})

					// Wait a bit for the server to start
					await new Promise(resolve => setTimeout(resolve, 1000))
				}
			} else {
				if (ollamaProcess) {
					ollamaProcess.kill()
					ollamaProcess = null
				} else {
					execSync('pkill ollama', { stdio: 'ignore' })
				}
			}
			return true
		} catch (error) {
			console.error('Error toggling server:', error)
			return false
		}
	})

	ipcMain.handle('ollama-model-download', async (_, modelId) => {
		try {
			const result = execSync(`ollama download ${modelId}`, { stdio: 'pipe' })
			return result.toString()
		} catch (error) {
			if (error instanceof Error) {
				return error.message
			}
			return 'An unknown error occurred (ollama-model-download)'
		}
	})

	ipcMain.handle('ollama-model-remove', async (_, modelId) => {
		try {
			const result = execSync(`ollama rm ${modelId}`, { stdio: 'pipe' })
			return result.toString()
		} catch (error) {
			if (error instanceof Error) {
				return error.message
			}
			return 'An unknown error occurred (ollama-model-remove)'
		}
	})

}
