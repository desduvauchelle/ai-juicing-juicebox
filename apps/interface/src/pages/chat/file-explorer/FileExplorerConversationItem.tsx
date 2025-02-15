
import { faComment, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useRef, useEffect, useMemo } from "react"
import { useDrag, useDrop } from "react-dnd"
import { IConversation } from "../../../../../../types/IConversation"
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from "react-router-dom"
import { useMainContext } from "../../../context/MainContext"
import { IconChat } from "../../../svg/SvgIcons"

export interface FileExplorerItemProps {
	item: IConversation
	depth: number
	isActive: boolean
}

const FileExplorerConversationItem: React.FC<FileExplorerItemProps> = ({
	item,
	depth,
	isActive
}) => {
	const navigate = useNavigate()
	const [isRenaming, setIsRenaming] = useState(false)
	const [newName, setNewName] = useState(item.name)
	const inputRef = useRef<HTMLInputElement>(null)
	const mainContext = useMainContext()

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'FILE_ITEM',
		item: { id: item.id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}))

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'FILE_ITEM',
		drop: (draggedItem: { id: number }) => {
			if (draggedItem.id !== item.id) {
				// onMove(draggedItem.id, item.id)
			}
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
			mainContext.actions.conversations.rename({
				id: item.id,
				newName: newName
			})
		}
		setIsRenaming(false)
	}

	useEffect(() => {
		if (isRenaming && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isRenaming])

	const paddingLeft = 12 + depth * 12

	const fileName = useMemo(() => {
		if (item.name) return item.name
		if ("updatedAt" in item) return `Conversation: ${formatDistanceToNow(new Date(item.updatedAt))} ago`
		return 'Untitled'
	}, [item])

	return <li
		ref={(node) => drag(drop(node))}>
		<a
			href={`#chat/${item.id}`}
			className={`relative flex items-center py-1 hover:bg-slate-100/5 cursor-pointer group
			${isActive ? 'bg-primary/30' : ''}
		${isDragging ? 'opacity-50 bg-slate-100/30' : ''} ${isOver ? 'bg-base-200' : ''}`}
			style={{ paddingLeft: `${paddingLeft}px` }}>
			<div className="flex items-center flex-1 py-1">
				<span
					className="mr-2 ">
					<IconChat color="white" className="h-4" />
				</span>

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
								setNewName(item.name)
								setIsRenaming(false)
							}
						}}
						className="border rounded px-1"
					/>
				</form>}
				{!isRenaming && <>
					<span
						className="flex-1 pr-6 border border-transparent line-clamp-1"
						onClick={() => { }}
						onDoubleClick={handleDoubleClick}>
						{fileName}
					</span>
				</>}

			</div>


			{!isRenaming && <button
				aria-label='Delete item'
				onClick={async (e) => {
					e.stopPropagation()
					e.preventDefault()
					const conf = confirm('Are you sure you want to delete this item?')
					if (!conf) return
					await mainContext.actions.conversations.delete({ id: item.id })
					// If it's active, I should useNavigate
					if (isActive) {
						navigate('/chat')
					}
				}}
				className="absolute top-0 right-0 h-full px-3 hover:text-red-500 opacity-0 group-hover:opacity-30 hover:opacity-100 translate-x-full group-hover:translate-x-0">
				<FontAwesomeIcon icon={faTimes} />
			</button>}

		</a>
	</li>
}

export default FileExplorerConversationItem
