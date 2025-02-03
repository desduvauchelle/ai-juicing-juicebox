import createDBService from './db'
import { ILlmConfig } from '../../types/ILlmConfig'

class LlmConfigurationService {
	// Initialize the correct DB service based on the environment.
	private static dbService = createDBService<ILlmConfig>('llm-configs')

	static async createConfig(config: ILlmConfig): Promise<ILlmConfig> {
		return this.dbService.create(config)
	}

	static async updateConfig(id: number, updatedConfig: Partial<ILlmConfig>): Promise<void> {
		return this.dbService.update(id, updatedConfig)
	}

	static async deleteConfig(id: number): Promise<void> {
		return this.dbService.delete(id)
	}

	static async getAllConfigs(): Promise<Array<ILlmConfig>> {
		return this.dbService.getAll()
	}

	static async getConfigById(id: number): Promise<ILlmConfig> {
		return this.dbService.getById(id)
	}

	static async searchConfigs(query: string, page: number = 1, limit: number = 10): Promise<Array<ILlmConfig>> {
		return this.dbService.search(query, page, limit)
	}

	static async setDefaultConfig(id: number): Promise<void> {
		const allConfigs = await this.getAllConfigs()
		const configsToUpdate: Array<ILlmConfig> = []
		allConfigs.forEach((config) => {
			if (config.id === id) {
				configsToUpdate.push({ ...config, isDefault: true })
			} else {
				configsToUpdate.push({ ...config, isDefault: false })
			}
		})
		await Promise.all(configsToUpdate.map((config) =>
			this.updateConfig(config.id, { isDefault: config.isDefault })
		))
	}
}

export default LlmConfigurationService
