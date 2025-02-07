import { IAIService } from './IAIService'
import { IFileExplorerFolder } from './IFolder'
export interface UserSettings {
	theme?: string
	language?: string
	notificationsEnabled?: boolean
	windowSize?: {
		x?: number
		y?: number
		width?: number
		height?: number
	},
	aiServices?: IAIService[]
	folders?: IFileExplorerFolder[]
}
