import { UserSettings } from "../../types/UserSettings"

const LOCAL_STORAGE_KEY = 'juicebox-by-ai-juicing-user-settings'

export const UserSettingsService = {
	get: async (): Promise<UserSettings | undefined> => {
		try {
			// if (window.electron) {
			// 	return await window.electron.generalSettingsGet()
			// }
			const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
			return stored ? JSON.parse(stored) : undefined
		} catch (error) {
			console.error('Failed to get user settings:', error)
			throw error
		}
	},

	save: async (settings: Partial<UserSettings>): Promise<UserSettings | undefined> => {
		try {
			// if (window.electron) {
			// 	return await window.electron.generalSettingsSave(settings)
			// }
			const current = await UserSettingsService.get()
			const newSettings = { ...current, ...settings }
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
			return newSettings
		} catch (error) {
			console.error('Failed to save user settings:', error)
			throw error
		}
	},

	clear: async () => {
		try {
			// if (window.electron) {
			// 	await window.electron.generalSettingsClear()
			// }
			localStorage.removeItem(LOCAL_STORAGE_KEY)
		} catch (error) {
			console.error('Failed to clear user settings:', error)
			throw error
		}
	}
}

export type UserSettingsServiceType = typeof UserSettingsService
