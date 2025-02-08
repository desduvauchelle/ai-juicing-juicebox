import { BrowserWindow, screen } from 'electron'
import Store from 'electron-store'

type windowSize = {
	x?: number
	y?: number
	width?: number
	height?: number
}

interface StoreSchema {
	windowSize?: windowSize
}

// Using type assertion to ensure TypeScript recognizes the methods
const storage = new Store<StoreSchema>({
	defaults: {
		windowSize: undefined
	}
}) as Store<StoreSchema> & {
	get(key: keyof StoreSchema): StoreSchema[keyof StoreSchema]
	set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void
}

const DEFAULT_WINDOW_SIZE = {
	width: 1000,
	height: 800
}

export async function saveWindowState(window: BrowserWindow): Promise<void> {
	if (!window) return

	try {
		const bounds = window.getBounds()
		storage.set('windowSize', {
			x: bounds.x,
			y: bounds.y,
			width: bounds.width,
			height: bounds.height
		})
	} catch (error) {
		console.error('Failed to save window state:', error)
		// Continue execution - not critical if save fails
	}
}

export async function loadWindowState(window: BrowserWindow): Promise<void> {
	try {
		const windowSize = storage.get('windowSize') as windowSize | undefined

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
