import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MyLink } from '../../../components/Button'
import { useMemo, useState } from 'react'
import FileExplorerConversationItem from './FileExplorerConversationItem'
import FileExplorerFolderItem from './FileExplorerFolderItem'
import { useFileExplorer } from '../../../context/FileExplorerContext'


const FileExplorer: React.FC = () => {
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

		<div className="w-full block px-3">
			<MyLink
				href="#chat/new"
				theme="primary"
				isButton
				className="block w-full text-center">
				<FontAwesomeIcon icon={faPlus} /> Chat
			</MyLink>
		</div>

		<div className="overflow-auto">
			{fileExplorer.folders.map(folder => {
				return <FileExplorerFolderItem
					key={folder.id}
					folder={folder}
					depth={0} />
			})}
			<button
				onClick={() => {
					setShowNewFolder(!showNewFolder)
				}}
				className="pl-8 w-full text-left py-2 hover:bg-gray-100/15 opacity-30 hover:opacity-100 rounded">
				{showNewFolder && <>Cancel</>}
				{!showNewFolder && <>
					<FontAwesomeIcon icon={faPlus} /> Folder
				</>}
			</button>
			{showNewFolder && <form onSubmit={handleNewFolder}
				className='overflow-hidden bg-slate-400/30 rounded-xl mx-2'>
				<input
					aria-label='New folder name'
					placeholder='New folder name...'
					type="text"
					autoFocus
					value={newItemName}
					onChange={(e) => setNewItemName(e.target.value)}
					className="p-2 w-full"
				/>
				<button
					type="submit"
					className="p-2 w-full bg-blue-500 text-white">
					Create folder
				</button>
			</form>}
			<div className="px-3 border-b border-slate-700 pb-2 pt-4">Recent</div>
			{noFolderConversations.map((conversation => {
				return <FileExplorerConversationItem
					key={conversation.id}
					item={conversation}
					depth={0} />
			}))}

		</div>

	</DndProvider>

}

export default FileExplorer
