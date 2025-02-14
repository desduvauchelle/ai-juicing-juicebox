import { UserSettings } from "../../types/UserSettings"

const LOCAL_STORAGE_KEY = 'juicebox-by-ai-juicing-user-settings'

// @ts-expect-error - This is a global variable injected in the vite builder
const interfaceDestination = window.DESTINATION

// In-memory storage for GitHub destination
let inMemorySettings: UserSettings | undefined

export const UserSettingsService = {
	get: async (): Promise<UserSettings | undefined> => {
		try {
			if (interfaceDestination === 'github') {
				return inMemorySettings
			}
			const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
			return stored ? JSON.parse(stored) : undefined
		} catch (error) {
			console.error('Failed to get user settings:', error)
			throw error
		}
	},

	save: async (settings: Partial<UserSettings>): Promise<UserSettings | undefined> => {
		try {
			const current = await UserSettingsService.get()
			const newSettings = { ...current, ...settings }

			if (interfaceDestination === 'github') {
				inMemorySettings = newSettings
				return newSettings
			}

			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
			return newSettings
		} catch (error) {
			console.error('Failed to save user settings:', error)
			throw error
		}
	},

	clear: async () => {
		try {
			if (interfaceDestination === 'github') {
				inMemorySettings = undefined
				return
			}
			localStorage.removeItem(LOCAL_STORAGE_KEY)
		} catch (error) {
			console.error('Failed to clear user settings:', error)
			throw error
		}
	}
}

export type UserSettingsServiceType = typeof UserSettingsService
