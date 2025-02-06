import { BrowserWindow, screen } from 'electron'
import { UserSettingsService } from '../services/UserSettingsService'

const DEFAULT_WINDOW_SIZE = {
	width: 1000,
	height: 600
}

export async function saveWindowState(window: BrowserWindow): Promise<void> {
	if (!window) return

	try {
		const bounds = window.getBounds()
		await UserSettingsService.save({
			windowSize: {
				x: bounds.x,
				y: bounds.y,
				width: bounds.width,
				height: bounds.height
			}
		})
	} catch (error) {
		console.error('Failed to save window state:', error)
		// Continue execution - not critical if save fails
	}
}

export async function loadWindowState(window: BrowserWindow): Promise<void> {
	try {
		const settings = await UserSettingsService.get()
		const windowSize = settings.windowSize

		// Handle undefined windowSize or missing required properties
		if (!windowSize?.x || !windowSize?.y || !windowSize?.width || !windowSize?.height) {
			window.setSize(DEFAULT_WINDOW_SIZE.width, DEFAULT_WINDOW_SIZE.height)
			window.center()
			return
		}

		const displays = screen.getAllDisplays()
		let isVisible = false

		// Check if the saved position is visible on any display
		for (const display of displays) {
			const bounds = display.bounds
			if (
				windowSize.x >= bounds.x &&
				windowSize.y >= bounds.y &&
				windowSize.x + windowSize.width <= bounds.x + bounds.width &&
				windowSize.y + windowSize.height <= bounds.y + bounds.height
			) {
				isVisible = true
				break
			}
		}

		if (isVisible) {
			window.setBounds({
				x: windowSize.x,
				y: windowSize.y,
				width: windowSize.width,
				height: windowSize.height
			})
		} else {
			window.setSize(DEFAULT_WINDOW_SIZE.width, DEFAULT_WINDOW_SIZE.height)
			window.center()
		}
	} catch (error) {
		console.error('Failed to load window state:', error)
		// Use default size if loading fails
		window.setSize(DEFAULT_WINDOW_SIZE.width, DEFAULT_WINDOW_SIZE.height)
		window.center()
	}
}
