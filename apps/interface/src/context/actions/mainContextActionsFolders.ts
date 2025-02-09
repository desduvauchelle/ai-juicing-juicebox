import { IFileExplorerFolder } from "../../../types/IFolder"
import FolderService from "../../services/FolderService"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const createMainContextActionsFolders = ({
	setFolders,
}: {
	setFolders: SetState<IFileExplorerFolder[]>,
}) => ({
	toggle: async ({
		folderId,
		isOpen,
	}: {
		folderId: number,
		isOpen: boolean,
	}) => {
		await FolderService.updateFolder(folderId, { isOpen: !isOpen })
		setFolders(prev => prev.map(folder =>
			folder.id === folderId
				? { ...folder, isOpen: !folder.isOpen }
				: folder
		))
	},
	rename: async ({
		folderId,
		newName,
	}: {
		folderId: number,
		newName: string,
	}) => {
		await FolderService.updateFolder(folderId, { name: newName })
		setFolders(prev => prev.map(folder =>
			folder.id === folderId
				? { ...folder, name: newName }
				: folder
		))
	},
	delete: async ({
		folderId,
	}: {
		folderId: number
	}) => {
		await FolderService.deleteFolder(folderId)
		setFolders(prev => prev.filter(folder => folder.id !== folderId))
	},
	create: async ({
		name,
	}: {
		name: string,
	}) => {
		if (!name.trim()) return
		let order = 0
		// Grab current length via updater
		setFolders(prev => {
			order = prev.length
			return prev
		})
		const newFolder = await FolderService.createFolder({
			id: 1,
			name: name.trim(),
			type: 'folder',
			isOpen: true,
			parentId: null,
			order: order
		})
		setFolders(prev => [...prev, newFolder])
	},
	move: async ({
		dragId,
		hoverId,
	}: {
		dragId: number,
		hoverId: number,
	}) => {
		let currentFolders: IFileExplorerFolder[] = []
		// Access current folders state
		setFolders(prev => {
			currentFolders = [...prev].sort((a, b) => a.order - b.order)
			const dragIndex = currentFolders.findIndex(folder => folder.id === dragId)
			const hoverIndex = currentFolders.findIndex(folder => folder.id === hoverId)
			const dragFolder = currentFolders[dragIndex]
			const newFolders = [...currentFolders]
			newFolders.splice(dragIndex, 1)
			newFolders.splice(hoverIndex, 0, dragFolder)
			return newFolders
		})
		await Promise.all(currentFolders.map(async (folder, index) => {
			await FolderService.updateFolder(folder.id, { order: index })
		}))
		const updatedItems = await FolderService.getAllFolders()
		const updatedSortedFolders = updatedItems.sort((a, b) => a.order - b.order)
		setFolders(updatedSortedFolders)
	}
})

export type MainContextActionsFolders = ReturnType<typeof createMainContextActionsFolders>
export default createMainContextActionsFolders
