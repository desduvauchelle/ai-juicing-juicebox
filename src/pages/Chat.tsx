import { faCog, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Button, { MyLink } from '../components/Button'
import FileExplorer from './chat/file-explorer/FileExplorer'
import ChatViewNew from './chat/ChatViews/ChatViewNew'
import { FileExplorerProvider } from '../context/FileExplorerContext'
import { ConversationProvider } from '../context/ConversationContext'
import ChatViewWrapper from './chat/ChatViewWrapper'

const Chat: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(true)


	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return (
		<div className="h-screen relative flex overflow-hidden">
			<div className={`absolute h-full w-64 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
				<div className="flex justify-between items-center mt-6">
					<h2 className="text-xl pl-4">Chats</h2>
					<Button aria-label="Hide menu" theme="custom"
						className='btn'
						onClick={toggleMenu}>
						<FontAwesomeIcon icon={faSquareCaretDown} className='rotate-90' />
					</Button>
				</div>
				<div className=" flex-grow w-full overflow-y-auto overflow-x-hidden">
					<FileExplorer />
				</div>
				<MyLink href="/settings" theme="ghost" isButton>
					<FontAwesomeIcon icon={faCog} className='mr-1' /> Settings
				</MyLink>
			</div>
			<div
				className={`flex-1 transition-all duration-300 p-4 pl-0 ${isMenuOpen ? 'ml-64' : 'ml-0 pl-4'}`}>
				<div className="bg-base-100 h-full rounded-xl overflow-hidden relative">

					{/* Chat content */}
					{!isMenuOpen && <Button aria-label="Hide menu" onClick={toggleMenu} theme="ghost" className='absolute top-4 left-4'>
						<FontAwesomeIcon icon={faSquareCaretDown} className='rotate-90' />
					</Button>}

					<Routes>
						<Route path="new" element={<ChatViewNew />} />
						<Route path=":chatId" element={<ChatViewWrapper />} />
					</Routes>
				</div>
			</div>
		</div>
	)
}

const ChatWrapper: React.FC = () => {
	return <FileExplorerProvider>
		<ConversationProvider>
			<Chat />
		</ConversationProvider>
	</FileExplorerProvider>
}

export default ChatWrapper
