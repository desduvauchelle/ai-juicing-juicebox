import { UserSettings } from './UserSettings'
export interface SystemInfo {
	os: {
		platform: string
		distro: string
		release: string
		arch: string
	}
	cpu: {
		manufacturer: string
		brand: string
		cores: number
	}
	memory: {
		total: number
		free: number
	}
	disk: {
		total: number
		free: number
	}
	graphics: {
		controllers: Array<{
			model: string
			vram: number
		}>
	}
}

export interface OllamaRemoteModel {
	name: string
	description: string
	tags: string[]
}

export interface ElectronAPI {
	ollamaInstallCheck: () => Promise<boolean>
	ollamaServerToggle: (start: boolean) => Promise<boolean>
	ollamaModelDownload: (modelId: string) => Promise<string>
	ollamaModelRemove: (modelId: string) => Promise<string>
	systemInfoGet: () => Promise<SystemInfo>
	ollamaModelRemote: () => Promise<OllamaRemoteModel[]>
}


declare global {
	interface Window {
		electron?: ElectronAPI
	}
}
