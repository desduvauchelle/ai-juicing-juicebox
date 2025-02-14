import { IAIService } from './IAIService'
import { IFileExplorerFolder } from './IFolder'
export interface UserSettings {
	theme?: string
	language?: string
	notificationsEnabled?: boolean
	aiServices?: IAIService[]
	folders?: IFileExplorerFolder[]
	defaultAiService?: {
		configId: number | string,
		modelName: string
	}
}
