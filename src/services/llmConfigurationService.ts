import IndexedDBService from './db'
import { ILlmConfig } from '../../types/ILlmConfig'

class LlmConfigurationService {
	private static dbService: IndexedDBService<ILlmConfig> = new IndexedDBService<ILlmConfig>('llm-configs')

	static async createConfig(config: ILlmConfig): Promise<ILlmConfig & { id: IDBValidKey }> {
		return this.dbService.create(config)
	}

	static async updateConfig(id: IDBValidKey, updatedConfig: Partial<ILlmConfig>): Promise<void> {
		return this.dbService.update(id, updatedConfig)
	}

	static async deleteConfig(id: IDBValidKey): Promise<void> {
		return this.dbService.delete(id)
	}

	static async getAllConfigs(): Promise<Array<ILlmConfig & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static async getConfigById(id: IDBValidKey): Promise<ILlmConfig & { id: IDBValidKey }> {
		return this.dbService.getById(id)
	}

	static async searchConfigs(query: string, page: number = 1, limit: number = 10): Promise<Array<ILlmConfig & { id: IDBValidKey }>> {
		return this.dbService.search(query, page, limit)
	}
}

export default LlmConfigurationService
