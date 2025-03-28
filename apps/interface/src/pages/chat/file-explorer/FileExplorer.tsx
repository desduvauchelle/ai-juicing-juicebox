import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from '../../../components/Button'
import { useMemo, useState } from 'react'
import FileExplorerConversationItem from './FileExplorerConversationItem'
import FileExplorerFolderItem from './FileExplorerFolderItem'
import { useMainContext } from '../../../context/MainContext'


const FileExplorer: React.FC<{ conversationId?: string }> = ({ conversationId }) => {
	const [showNewFolder, setShowNewFolder] = useState(false)
	const [newItemName, setNewItemName] = useState('')
	const mainContext = useMainContext()



	const noFolderConversations = useMemo(() => {
		return mainContext.conversations.filter(conversation => !conversation.folderId)
	}, [mainContext.conversations])



	const handleNewFolder = (e: React.FormEvent) => {
		e.preventDefault()
		// onNewFolder(newItemName)
		mainContext.actions.folders.create({
			name: newItemName
		})
		setNewItemName('')
		setShowNewFolder(false)
	}

	return <DndProvider backend={HTML5Backend}>



		<ul className="menu w-full">
			{mainContext.folders.map(folder => {
				return <FileExplorerFolderItem
					activeConversationId={conversationId}
					key={folder.id}
					folder={folder}
					depth={0} />
			})}

		</ul>


		<button
			onClick={() => {
				setShowNewFolder(!showNewFolder)
			}}
			className="w-full text-left px-6 py-2 hover:bg-base-100/15 opacity-30 hover:opacity-100 rounded">
			{showNewFolder && <>Cancel</>}
			{!showNewFolder && <>
				<FontAwesomeIcon icon={faPlus} /> Folder
			</>}
		</button>

		{showNewFolder && <form onSubmit={handleNewFolder}
			className='overflow-hidden bg-base-200/30 rounded-xl mx-2'>
			<input
				aria-label='New folder name'
				placeholder='New folder name...'
				type="text"
				autoFocus
				value={newItemName}
				onChange={(e) => setNewItemName(e.target.value)}
				className="p-2 w-full rounded-t-xl"
			/>
			<Button
				theme="primary"
				type="submit"
				className="w-full ">
				Create folder
			</Button>
		</form>}

		<div className="divider uppercase opacity-30 font-medium text-xs">Recent</div>
		<ul className="menu w-full">
			{noFolderConversations.map((conversation => {
				return <FileExplorerConversationItem
					isActive={conversation.id.toString() === conversationId}
					key={conversation.id}
					item={conversation}
					depth={0} />
			}))}
		</ul>
	</DndProvider>

}

export default FileExplorer
