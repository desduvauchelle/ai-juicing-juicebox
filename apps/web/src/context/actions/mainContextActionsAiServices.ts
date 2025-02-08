import { IAIService } from "../../../types/IAIService"
import AiServiceService from "../../services/AiServiceService"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const createMainContextActionsAiServices = ({
	setAiServices,
}: {
	setAiServices: SetState<Array<IAIService & { id: number }>>,
}) => ({
	create: async (config: IAIService) => {
		const newConfig = await AiServiceService.createConfig(config)
		setAiServices(prev => [...prev, newConfig])
	},

	update: async ({
		configId,
		updates,
	}: {
		configId: number,
		updates: Partial<IAIService>,
	}) => {
		await AiServiceService.updateConfig(configId, updates)
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
		await AiServiceService.deleteConfig(configId)
		setAiServices(prev => prev.filter(config => config.id !== configId))
	},

	setDefault: async ({ configId }: { configId: number }) => {
		setAiServices(prev => {
			const newConfigs = prev.map(config => ({
				...config,
				isDefault: config.id === configId,
			}))
			return newConfigs
		})
	}
})

export type MainContextActionsAiServices = ReturnType<typeof createMainContextActionsAiServices>
export default createMainContextActionsAiServices
