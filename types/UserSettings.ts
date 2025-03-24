import { IAIService } from './IAIService'
import { IFileExplorerFolder } from './IFolder'

export interface UserSettingsSystemPrompt {
	id: string,
	name: string,
	prompt: string,
	isDefault?: boolean
}

export interface UserSettingsContext {
	id: string,
	name: string,
	context: string,
	isDefault?: boolean
}

export interface UserSettings {
	theme?: string
	language?: string
	cloudSyncEnabled?: boolean
	notificationsEnabled?: boolean
	aiServices?: IAIService[]
	folders?: IFileExplorerFolder[]
	defaultAiService?: {
		configId: number | string,
		modelName: string
	},
	systemPrompts?: UserSettingsSystemPrompt[],
	contexts?: UserSettingsContext[],
	defaultChatHistoryCount?: number
}
