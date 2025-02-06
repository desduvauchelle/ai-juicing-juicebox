import { UserSettings } from 'types/UserSettings'
import storage from '../tools/storage'

const STORAGE_FILE = "general-settings"



class GeneralService {
	// Save settings using the storage tool as a static method.
	static async save(settings: Partial<UserSettings>): Promise<void> {
		await storage.save({
			fileName: STORAGE_FILE,
			partialData: settings
		})
	}

	// Retrieve settings using the storage tool as a static method.
	static async get(): Promise<UserSettings> {
		return await storage.get({
			fileName: STORAGE_FILE,
			defaultData: {}
		})
	}

	// Clear settings by overwriting with an empty object as a static method.
	static async clear(): Promise<void> {
		await storage.save({
			fileName: STORAGE_FILE,
			partialData: {}
		})
	}
}

export { GeneralService }
