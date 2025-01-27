export interface ElectronAPI {
	checkOllamaInstalled?: () => boolean
	// Add other electron methods here as needed
}

declare global {
	interface Window {
		electron?: ElectronAPI
	}
}
