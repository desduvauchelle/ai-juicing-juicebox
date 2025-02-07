import { IAIService } from '../../types/IAIService'
import { UserSettingsService } from './UserSettingsService'

class AiServiceService {
	private static async getConfigs(): Promise<Array<IAIService & { id: number }>> {
		const settings = await UserSettingsService.get() || {}
		return settings.aiServices || []
	}

	private static async saveConfigs(configs: Array<IAIService & { id: number }>) {
		await UserSettingsService.save({ aiServices: configs })
	}

	static async createConfig(config: IAIService): Promise<IAIService & { id: number }> {
		const configs = await this.getConfigs()
		const newId = configs.length > 0 ? Math.max(...configs.map(c => c.id)) + 1 : 1
		const newConfig = { ...config, id: newId }
		configs.push(newConfig)
		await this.saveConfigs(configs)
		return newConfig
	}

	static async updateConfig(id: number, updatedConfig: Partial<IAIService>): Promise<void> {
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

	static async getAllConfigs(): Promise<Array<IAIService & { id: number }>> {
		return this.getConfigs()
	}

	static async getConfigById(id: number): Promise<IAIService & { id: number }> {
		const configs = await this.getConfigs()
		const config = configs.find(c => c.id === id)
		if (!config) throw new Error('Config not found')
		return config
	}

	static async setDefaultConfig(id: number): Promise<void> {
		const configs = await this.getConfigs()
		const targetConfig = configs.find(c => c.id === id)
		if (!targetConfig) throw new Error('Config not found')

		const updatedConfigs = configs.map(config => ({
			...config,
			isDefault: config.service === targetConfig.service ?
				config.id === id :
				config.isDefault
		}))
		await this.saveConfigs(updatedConfigs)
	}
}

export default AiServiceService
