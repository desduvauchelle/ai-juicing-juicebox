import { ElectronAPI, OllamaRemoteModel, SystemInfo } from "../../types/Electron"

const electron = window.electron as ElectronAPI

export const bridgeApi: ElectronAPI = {
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

	systemInfoGet: async (): Promise<SystemInfo> => {
		const info = await electron?.systemInfoGet()
		if (!info) {
			throw new Error('SystemInfo not available')
		}
		return info
	},

	ollamaModelRemote: async (): Promise<OllamaRemoteModel[]> => {
		return electron?.ollamaModelRemote() ?? []
	},


}
