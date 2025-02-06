import { ILlmConfig } from '../../types/ILlmConfig'
import { UserSettingsService } from './UserSettingsService'

class LlmConfigService {
	private static async getConfigs(): Promise<Array<ILlmConfig & { id: number }>> {
		const settings = await UserSettingsService.get() || {}
		return settings.llmConfigs || []
	}

	private static async saveConfigs(configs: Array<ILlmConfig & { id: number }>) {
		await UserSettingsService.save({ llmConfigs: configs })
	}

	static async createConfig(config: ILlmConfig): Promise<ILlmConfig & { id: number }> {
		const configs = await this.getConfigs()
		const newId = configs.length > 0 ? Math.max(...configs.map(c => c.id)) + 1 : 1
		const newConfig = { ...config, id: newId }
		configs.push(newConfig)
		await this.saveConfigs(configs)
		return newConfig
	}

	static async updateConfig(id: number, updatedConfig: Partial<ILlmConfig>): Promise<void> {
		const configs = await this.getConfigs()
		const index = configs.findIndex(c => c.id === id)
		if (index === -1) throw new Error('Config not found')
		configs[index] = { ...configs[index], ...updatedConfig }
		await this.saveConfigs(configs)
	}

	static async deleteConfig(id: number): Promise<void> {
		const configs = await this.getConfigs()
		const filtered = configs.filter(c => c.id !== id)
		await this.saveConfigs(filtered)
	}

	static async getAllConfigs(): Promise<Array<ILlmConfig & { id: number }>> {
		return this.getConfigs()
	}

	static async getConfigById(id: number): Promise<ILlmConfig & { id: number }> {
		const configs = await this.getConfigs()
		const config = configs.find(c => c.id === id)
		if (!config) throw new Error('Config not found')
		return config
	}

	static async setDefaultConfig(id: number): Promise<void> {
		const configs = await this.getConfigs()
		const updatedConfigs = configs.map(config => ({
			...config,
			isDefault: config.id === id
		}))
		await this.saveConfigs(updatedConfigs)
	}
}

export default LlmConfigService
