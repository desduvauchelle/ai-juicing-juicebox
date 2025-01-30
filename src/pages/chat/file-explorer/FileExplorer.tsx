import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from '../../../components/Button'
import { useMemo, useState } from 'react'
import FileExplorerConversationItem from './FileExplorerConversationItem'
import FileExplorerFolderItem from './FileExplorerFolderItem'
import { useFileExplorer } from '../../../context/FileExplorerContext'


const FileExplorer: React.FC<{ conversationId?: string }> = ({ conversationId }) => {
	const [showNewFolder, setShowNewFolder] = useState(false)
	const [newItemName, setNewItemName] = useState('')
	const fileExplorer = useFileExplorer()



	const noFolderConversations = useMemo(() => {
		return fileExplorer.conversations.filter(conversation => !conversation.folderId)
	}, [fileExplorer.conversations])



	const handleNewFolder = (e: React.FormEvent) => {
		e.preventDefault()
		// onNewFolder(newItemName)
		fileExplorer.actions.folder.create(newItemName)
		setNewItemName('')
		setShowNewFolder(false)
	}

	return <DndProvider backend={HTML5Backend}>



		<div className="overflow-auto">
			{fileExplorer.folders.map(folder => {
				return <FileExplorerFolderItem
					activeConversationId={conversationId}
					key={folder.id}
					folder={folder}
					depth={0} />
			})}
			<button
				onClick={() => {
					setShowNewFolder(!showNewFolder)
				}}
				className="pl-8 w-full text-left py-2 hover:bg-base-100/15 opacity-30 hover:opacity-100 rounded">
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
			<div className="px-3 border-b border-slate-700 pb-3 mb-3 pt-6">Recent</div>
			{noFolderConversations.map((conversation => {
				return <FileExplorerConversationItem
					isActive={conversation.id.toString() === conversationId}
					key={conversation.id}
					item={conversation}
					depth={0} />
			}))}

		</div>

	</DndProvider>

}

export default FileExplorer
