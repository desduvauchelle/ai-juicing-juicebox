import { ILlmConfig } from './ILlmConfig'
import { IFileExplorerFolder } from './IFolder'
export interface UserSettings {
	theme?: string
	language?: string
	notificationsEnabled?: boolean
	windowSize?: {
		width: number
		height: number
	},
	llmConfigs?: ILlmConfig[]
	folders?: IFileExplorerFolder[]
}
