
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useRef, useEffect, useMemo } from "react"
import { useDrag, useDrop } from "react-dnd"
import FileExplorerConversationItem from "./FileExplorerConversationItem"
import { IFileExplorerFolder } from "../../../../types/IFolder"
import { useMainContext } from "../../../context/MainContext"

import { IconFolder, IconFolderMinus } from "../../../svg/SvgIcons"

export interface FileExplorerItemProps {
	folder: IFileExplorerFolder
	depth: number,
	activeConversationId?: string
}

const FileExplorerFolderItem: React.FC<FileExplorerItemProps> = ({
	folder,
	depth,
	activeConversationId
}) => {
	const [isRenaming, setIsRenaming] = useState(false)
	const [newName, setNewName] = useState(folder.name)
	const inputRef = useRef<HTMLInputElement>(null)
	const mainContext = useMainContext()

	const conversations = useMemo(() => {
		return mainContext.conversations.filter(conversation => conversation.folderId === folder.id)
	}, [mainContext.conversations, folder.id])

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'FOLDER_ITEM',
		item: { id: folder.id, type: 'folder' },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	const [{ isOver }, drop] = useDrop(() => ({
		accept: ['FILE_ITEM', 'FOLDER_ITEM'],
		drop: (draggedItem: { id: number, type: string }) => {
			console.log(draggedItem)
			if (draggedItem.type === 'folder') {
				if (draggedItem.id === folder.id) return
				mainContext.actions.folders.move({
					dragId: draggedItem.id,
					hoverId: folder.id
				})
			}
			// It's a conversation, move it to the folder
			// addConversationToFolder(draggedItem.id, folder.id)
			mainContext.actions.conversations.update({
				id: draggedItem.id,
				partial: {
					folderId: folder.id
				}
			})
			// mainContext.actions.conversations.
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}))

	const handleDoubleClick = () => {
		setIsRenaming(true)
	}

	const handleRename = () => {
		if (newName.trim()) {
			mainContext.actions.folders.rename({
				folderId: folder.id,
				newName
			})
		}
		setIsRenaming(false)
	}

	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isRenaming])

	const fileName = useMemo(() => {
		if (folder.name) return folder.name
		return 'Untitled'
	}, [folder])

	return <li
		ref={(node) => drag(drop(node))}
		className={`relative flex flex-col cursor-pointer group/folder rounded-xl
		${isDragging ? 'opacity-50 bg-slate-400/30' : ''} ${isOver ? 'bg-slate-400/30' : ''}`}>
		<div className="flex items-center flex-1">
			<button
				aria-label='Toggle item'
				onClick={() => mainContext.actions.folders.toggle({ folderId: folder.id, isOpen: !folder.isOpen })}
				className=" text-yellow-600">
				{!folder.isOpen && <IconFolder color="orange" className="h-4" />}
				{folder.isOpen && <IconFolderMinus color="orange" className="h-4" />}
			</button>

			{isRenaming && <form onSubmit={(e) => {
				e.preventDefault()
				handleRename()
			}}>
				<input
					aria-label='Rename item'
					ref={inputRef}
					type="text"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
					onBlur={handleRename}
					onKeyDown={(e) => {
						if (e.key === 'Escape') {
							setNewName(folder.name)
							setIsRenaming(false)
						}
					}}
					className="border rounded px-1"
				/>
			</form>}
			{!isRenaming && <>
				<span
					className="flex-1 px-1 border border-transparent"
					onDoubleClick={handleDoubleClick}>
					{fileName}
				</span>
			</>}

		</div>


		<button
			aria-label='Delete item'
			onClick={(e) => {
				e.stopPropagation()
				const conf = confirm('Are you sure you want to delete this item?')
				if (!conf) return
				mainContext.actions.folders.delete({ folderId: folder.id })
			}}
			className="absolute top-0 right-0 h-full px-3 hover:text-red-500 opacity-0 group-hover:opacity-30 hover:opacity-100 translate-x-full group-hover:translate-x-0">
			<FontAwesomeIcon icon={faTimes} />
		</button>

		{(!isDragging && folder.isOpen) && <>
			<ul className="">
				{conversations.map(conversation => {
					return <FileExplorerConversationItem
						isActive={conversation.id.toString() === activeConversationId}
						key={conversation.id}
						item={conversation}
						depth={1} />
				})}
			</ul>
		</>}


	</li>

}

export default FileExplorerFolderItem
