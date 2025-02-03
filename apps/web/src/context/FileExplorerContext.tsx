import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { IConversation } from "../../types/IConversation"
import { IFileExplorerFolder } from "../../types/IFolder"
import ConversationService from "../services/ConversationService"
import FolderService from "../services/FolderService"

interface FileExplorerContextProps {
	folders: IFileExplorerFolder[]
	conversations: IConversation[]
	actions: {
		refresh: () => Promise<void>
		folder: {
			toggle: (id: number) => Promise<void>
			rename: (folderId: number, newName: string) => Promise<void>
			delete: (id: number) => Promise<void>
			move: (dragId: number, hoverId: number) => Promise<void>
			create: (folderName: string) => Promise<void>
			addConversation: (conversationId: number, folderId: number) => Promise<void>
		}
		conversation: {
			create: (conversation: IConversation) => Promise<IConversation>
			rename: (id: number, newName: string) => Promise<void>
			delete: (id: number) => Promise<void>
		}
	}
}

const FileExplorerContext = createContext<FileExplorerContextProps | undefined>(undefined)

export const FileExplorerProvider = ({ children }: { children: React.ReactNode }) => {
	const [folders, setFolders] = useState<IFileExplorerFolder[]>([])
	const [conversations, setConversations] = useState<IConversation[]>([])

	const fetchChats = useCallback(async () => {
		const allChats = await ConversationService.getDefaults()
		// Sort using updatedAt newest to oldest
		const sortedChats = allChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		setConversations(sortedChats)
	}, [])

	useEffect(() => {
		fetchChats()
	}, [fetchChats])

	const fetchFolders = useCallback(async () => {
		const folders = await FolderService.getAllFolders()
		const sortedFolders = folders.sort((a, b) => a.order - b.order)
		setFolders(sortedFolders)
	}, [])

	useEffect(() => {
		fetchFolders()
	}, [fetchFolders])

	const folderToggle = async (id: number) => {
		const item = await FolderService.getFolderById(id)
		if (item.type !== 'folder') return
		await FolderService.updateFolder(id, { isOpen: !item.isOpen })

		setFolders(prev => {
			return prev.map(folder => {
				if (folder.id === id) {
					return {
						...folder,
						isOpen: !folder.isOpen
					}
				}
				return folder
			})
		})
	}

	const folderRename = async (folderId: number, newName: string) => {
		await FolderService.updateFolder(folderId, { name: newName })
		setFolders(prev => {
			return prev.map(folder => {
				if (folder.id === folderId) {
					return {
						...folder,
						name: newName
					}
				}
				return folder
			})
		})
	}

	const folderDelete = async (id: number) => {
		const conversationsInThatFolder = conversations.filter(conversation => conversation.folderId === id)
		await Promise.all(conversationsInThatFolder.map(conversation => {
			return ConversationService.delete(conversation.id)
		}))
		setConversations(prev => {
			return prev.filter(conversation => conversation.folderId !== id)
		})

		await FolderService.deleteFolder(id)
		setFolders(prev => {
			return prev.filter(folder => folder.id !== id)
		})
	}

	const folderMove = async (dragId: number, hoverId: number) => {
		const allFolders = await FolderService.getAllFolders()
		const sortedFolders = allFolders.sort((a, b) => a.order - b.order)
		const dragIndex = sortedFolders.findIndex(folder => folder.id === dragId)
		const hoverIndex = sortedFolders.findIndex(folder => folder.id === hoverId)
		const dragFolder = sortedFolders[dragIndex]

		const newFolders = [...sortedFolders]
		newFolders.splice(dragIndex, 1)
		newFolders.splice(hoverIndex, 0, dragFolder)

		await Promise.all(newFolders.map(async (folder, index) => {
			await FolderService.updateFolder(folder.id, { order: index })
		}))
		const updatedItems = await FolderService.getAllFolders()
		const updatedSortedFolders = updatedItems.sort((a, b) => a.order - b.order)
		setFolders(updatedSortedFolders)
	}

	const folderCreate = async (folderName: string) => {
		if (!folderName.trim()) return
		const order = folders.length
		const newFolder = await FolderService.createFolder({
			id: 1,
			name: folderName,
			type: 'folder',
			isOpen: true,
			parentId: null,
			order: order
		})

		setFolders(prev => {
			return [
				...prev,
				newFolder
			]
		})
	}

	const conversationCreate = async (conversation: IConversation) => {
		const newConversation = await ConversationService.create(conversation)
		setConversations(prev => {
			return [
				newConversation,
				...prev
			]
		})
		return newConversation
	}

	const conversationRename = async (id: number, newName: string) => {
		await ConversationService.update(id, { name: newName })
		setConversations(prev => {
			return prev.map(conversation => {
				if (conversation.id === id) {
					return {
						...conversation,
						name: newName
					}
				}
				return conversation
			})
				.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		})
	}

	const conversationDelete = async (id: number) => {
		await ConversationService.delete(id)
		setConversations(prev => {
			return prev.filter(conversation => conversation.id !== id)
		})
	}

	const folderAddConversation = async (conversationId: number, folderId: number) => {
		await ConversationService.update(conversationId, { folderId })
		setConversations(prev => {
			return prev.map(conversation => {
				if (conversation.id === conversationId) {
					return {
						...conversation,
						folderId
					}
				}
				return conversation
			})
		})
	}

	const refresh = useCallback(async () => {
		await fetchFolders()
		await fetchChats()
	}, [fetchChats, fetchFolders])

	const value: FileExplorerContextProps = {
		folders,
		conversations,
		actions: {
			refresh,
			folder: {
				toggle: folderToggle,
				rename: folderRename,
				delete: folderDelete,
				move: folderMove,
				create: folderCreate,
				addConversation: folderAddConversation
			},
			conversation: {
				create: conversationCreate,
				rename: conversationRename,
				delete: conversationDelete
			}
		}
	}

	return <FileExplorerContext.Provider
		value={value}>
		{children}
	</FileExplorerContext.Provider>
}

export const useFileExplorer = () => {
	const context = useContext(FileExplorerContext)
	if (!context) {
		throw new Error('useFileExplorer must be used within a FileExplorerProvider')
	}
	return context
}
