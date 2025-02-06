import { IFileExplorerFolder } from '../../types/IFolder'
import { UserSettingsService } from './UserSettingsService'

class FolderService {
	private static async getFolders(): Promise<Array<IFileExplorerFolder & { id: number }>> {
		const settings = await UserSettingsService.get() || {}
		return settings.folders || []
	}

	private static async saveFolders(folders: Array<IFileExplorerFolder & { id: number }>) {
		await UserSettingsService.save({ folders })
	}

	static async createFolder(folder: IFileExplorerFolder): Promise<IFileExplorerFolder & { id: number }> {
		const folders = await this.getFolders()
		const newId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1
		const newFolder = { ...folder, id: newId }
		folders.push(newFolder)
		await this.saveFolders(folders)
		return newFolder
	}

	static async updateFolder(id: number, updatedFolder: Partial<IFileExplorerFolder>): Promise<void> {
		const folders = await this.getFolders()
		const index = folders.findIndex(f => f.id === id)
		if (index === -1) throw new Error('Folder not found')
		folders[index] = { ...folders[index], ...updatedFolder }
		await this.saveFolders(folders)
	}

	static async deleteFolder(id: number): Promise<void> {
		const folders = await this.getFolders()
		const filtered = folders.filter(f => f.id !== id)
		await this.saveFolders(filtered)
	}

	static async getAllFolders(): Promise<Array<IFileExplorerFolder & { id: number }>> {
		return this.getFolders()
	}

	static async getFolderById(id: number): Promise<(IFileExplorerFolder & { id: number }) | null> {
		const folders = await this.getFolders()
		return folders.find(f => f.id === id) || null
	}
}

export default FolderService
