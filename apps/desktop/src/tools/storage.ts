import { app } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'

interface StorageOptions {
	fileName: string
	partialData?: any
	defaultData?: any
}

class Storage {
	private getFilePath(fileName: string): string {
		// Ensure the filename has .json extension
		const fullPath = path.join(app.getPath('userData'), fileName)
		console.log('Storage path =======>', fullPath)
		return fullPath
	}

	private async ensureDirectory(filePath: string): Promise<void> {
		const dir = path.dirname(filePath)
		try {
			await fs.mkdir(dir, { recursive: true })
		} catch (error) {
			console.warn('Error creating directory:', error)
			throw error
		}
	}

	async save({ fileName, partialData }: StorageOptions): Promise<void> {
		try {
			const filePath = this.getFilePath(fileName)
			const tempPath = this.getFilePath(`${fileName}.tmp`)

			// Ensure directories exist for both paths
			await this.ensureDirectory(filePath)
			await this.ensureDirectory(tempPath)

			let newData = partialData

			try {
				await fs.access(filePath)
				const fileContent = await fs.readFile(filePath, 'utf-8')
				const existingData = JSON.parse(fileContent)
				newData = { ...existingData, ...partialData }
			} catch (error) {
				// File doesn't exist, use partialData as is
			}

			try {
				// Write to temp file first
				await fs.writeFile(tempPath, JSON.stringify(newData, null, 2))
				// Try atomic rename
				await fs.rename(tempPath, filePath)
			} catch (error) {
				console.warn('Error during save operation:', error)
				// Direct write fallback
				await fs.writeFile(filePath, JSON.stringify(newData, null, 2))
			} finally {
				try {
					await fs.unlink(tempPath)
				} catch {
					// Ignore cleanup errors
				}
			}
		} catch (error) {
			console.error('Fatal error in storage save:', error)
			throw error
		}
	}

	async get({ fileName, defaultData = {} }: StorageOptions): Promise<any> {
		try {
			const filePath = this.getFilePath(fileName)
			const fileContent = await fs.readFile(filePath, 'utf-8')
			return JSON.parse(fileContent)
		} catch (error) {
			// Return default data if file doesn't exist or is corrupt
			return defaultData
		}
	}
}

export default new Storage()
