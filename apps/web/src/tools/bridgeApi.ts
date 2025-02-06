import { ElectronAPI, OllamaRemoteModel, SystemInfo } from "../../types/Electron"

const electron = window.electron as ElectronAPI

export const bridgeApi = {
	ollamaInstallCheck: async (): Promise<boolean> => {
		return electron?.ollamaInstallCheck() ?? false
	},

	ollamaServerToggle: async (start: boolean): Promise<boolean> => {
		return electron?.ollamaServerToggle(start) ?? false
	},

	ollamaModelDownload: async (modelId: string): Promise<string> => {
		return electron?.ollamaModelDownload(modelId) ?? 'Error: Electron bridge not available'
	},

	ollamaModelRemove: async (modelId: string): Promise<string> => {
		return electron?.ollamaModelRemove(modelId) ?? 'Error: Electron bridge not available'
	},

	systemInfoGet: async (): Promise<SystemInfo | null> => {
		return electron?.systemInfoGet() ?? null
	},

	ollamaModelRemote: async (): Promise<OllamaRemoteModel[]> => {
		return electron?.ollamaModelRemote() ?? []
	}
}
