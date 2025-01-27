
export interface IFileExplorerFolder {
	id: number
	name: string
	parentId: number | null
	type: 'folder',
	isOpen: boolean
	order: number
}
