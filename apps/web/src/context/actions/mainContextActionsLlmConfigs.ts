import { ILlmConfig } from "../../../types/ILlmConfig"
import LlmConfigService from "../../services/LlmConfigService"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const createMainContextActionsLlmConfigs = ({
	setLlmConfigs,
}: {
	setLlmConfigs: SetState<Array<ILlmConfig & { id: number }>>,
}) => ({
	create: async (config: ILlmConfig) => {
		const newConfig = await LlmConfigService.createConfig(config)
		setLlmConfigs(prev => [...prev, newConfig])
	},

	update: async ({
		configId,
		updates,
	}: {
		configId: number,
		updates: Partial<ILlmConfig>,
	}) => {
		await LlmConfigService.updateConfig(configId, updates)
		setLlmConfigs(prev => prev.map(config =>
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
		setLlmConfigs(prev => prev.filter(config => config.id !== configId))
	},
})

export type MainContextActionsLlmConfigs = ReturnType<typeof createMainContextActionsLlmConfigs>
export default createMainContextActionsLlmConfigs
