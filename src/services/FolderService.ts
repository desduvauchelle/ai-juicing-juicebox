import { IFileExplorerFolder } from '../../types/IFolder'
import IndexedDBService from './db'

class FolderService {
	private static dbService: IndexedDBService<IFileExplorerFolder> = new IndexedDBService<IFileExplorerFolder>('folders')

	static async createFolder(folder: IFileExplorerFolder): Promise<IFileExplorerFolder & { id: IDBValidKey }> {
		return this.dbService.create(folder)
	}

	static async updateFolder(id: IDBValidKey, updatedFolder: Partial<IFileExplorerFolder>): Promise<void> {
		return this.dbService.update(id, updatedFolder)
	}

	static async deleteFolder(id: IDBValidKey): Promise<void> {
		return this.dbService.delete(id)
	}

	static async getAllFolders(): Promise<Array<IFileExplorerFolder & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static async getFolderById(id: IDBValidKey): Promise<IFileExplorerFolder & { id: IDBValidKey }> {
		return this.dbService.getById(id)
	}

	static async searchFolders(query: string, page: number = 1, limit: number = 10): Promise<Array<IFileExplorerFolder & { id: IDBValidKey }>> {
		return this.dbService.search(query, page, limit)
	}


}

export default FolderService
