import { IFileExplorerFolder } from '../../types/IFolder'
import createDBService from './db'

class FolderService {
	private static dbService = createDBService<IFileExplorerFolder>('folders')

	static async createFolder(folder: IFileExplorerFolder): Promise<IFileExplorerFolder & { id: number }> {
		return this.dbService.create(folder)
	}

	static async updateFolder(id: number, updatedFolder: Partial<IFileExplorerFolder>): Promise<void> {
		return this.dbService.update(id, updatedFolder)
	}

	static async deleteFolder(id: number): Promise<void> {
		return this.dbService.delete(id)
	}

	static async getAllFolders(): Promise<Array<IFileExplorerFolder & { id: number }>> {
		return this.dbService.getAll()
	}

	static async getFolderById(id: number): Promise<IFileExplorerFolder & { id: number }> {
		return this.dbService.getById(id)
	}

	static async searchFolders(query: string, page: number = 1, limit: number = 10): Promise<Array<IFileExplorerFolder & { id: number }>> {
		return this.dbService.search(query, page, limit)
	}


}

export default FolderService
