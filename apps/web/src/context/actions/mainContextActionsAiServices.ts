import { IAIService } from "../../../types/IAIService"
import LlmConfigService from "../../services/AiServiceService"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const createMainContextActionsAiServices = ({
	setAiServices,
}: {
	setAiServices: SetState<Array<IAIService & { id: number }>>,
}) => ({
	create: async (config: IAIService) => {
		const newConfig = await LlmConfigService.createConfig(config)
		setAiServices(prev => [...prev, newConfig])
	},

	update: async ({
		configId,
		updates,
	}: {
		configId: number,
		updates: Partial<IAIService>,
	}) => {
		await LlmConfigService.updateConfig(configId, updates)
		setAiServices(prev => prev.map(config =>
			config.id === configId
				? { ...config, ...updates }
				: config
		))
	},

	delete: async ({
		configId,
	}: {
		configId: number
	}) => {
		await LlmConfigService.deleteConfig(configId)
		setAiServices(prev => prev.filter(config => config.id !== configId))
	},

	setDefault: async ({ configId }: { configId: number }) => {
		setAiServices(prev => {
			const targetConfig = prev.find(c => c.id === configId)
			if (!targetConfig) return prev

			return prev.map(config => ({
				...config,
				isDefault: config.service === targetConfig.service ?
					config.id === configId :
					config.isDefault
			}))
		})
	}
})

export type MainContextActionsAiServices = ReturnType<typeof createMainContextActionsAiServices>
export default createMainContextActionsAiServices
