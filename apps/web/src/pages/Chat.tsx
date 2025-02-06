import { faCaretLeft, faChevronLeft, faChevronRight, faCog, faExclamation, faPlus, faSquareCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button, { MyLink } from '../components/Button'
import FileExplorer from './chat/file-explorer/FileExplorer'
import ChatViewNew from './chat/ChatViews/ChatViewNew'
import { FileExplorerProvider } from '../context/FileExplorerContext'
import { ConversationProvider } from '../context/ConversationContext'
import ChatViewWrapper from './chat/ChatViewWrapper'
import Logo from '../components/Logo'

const Chat: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(true)
	const { conversationId } = useParams<{ conversationId?: string }>()

	// const [chatId, setChatId] = useState<number | null>(null)

	// useEffect(() => {
	// 	if (!params["*"]) {
	// 		setChatId(null)
	// 		return
	// 	}
	// 	let id: number = 0
	// 	try {
	// 		id = parseInt(params["*"])
	// 	} catch (error) {
	// 		setChatId(null)
	// 	}
	// 	if (!id) {
	// 		setChatId(null)
	// 		return
	// 	}
	// }, [params])


	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	return <div className="h-screen relative flex overflow-hidden">
		<div className={`absolute h-full w-64 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
			<div className="flex justify-between items-center mt-6 pb-6">
				<Logo />
				<Button aria-label="Hide menu"
					theme="ghost"
					onClick={toggleMenu}>
					<FontAwesomeIcon icon={faChevronLeft} />
				</Button>
			</div>
			<div className="w-full block px-3 pb-2">
				<MyLink
					href="/chat"
					theme="primary"
					isButton
					className="w-full">
					<FontAwesomeIcon icon={faPlus} /> Chat
				</MyLink>
			</div>
			<div className="flex-grow w-full overflow-y-auto overflow-x-hidden">
				<FileExplorer conversationId={conversationId} />
			</div>

			<ul className="menu w-full border-t border-base-100">
				<li>
					<MyLink href="/settings" theme="custom" className="">
						<FontAwesomeIcon icon={faCog} /> Settings
					</MyLink>
				</li>
				<li>
					<MyLink href="/welcome" theme="custom" className="">
						<FontAwesomeIcon icon={faExclamation} /> Onboarding
					</MyLink>
				</li>
			</ul>
		</div>
		<div
			className={`flex-1 transition-all duration-300 p-4 pl-0 ${isMenuOpen ? 'ml-64' : 'ml-0 pl-4'} relative`}>
			<div className="bg-base-100 h-full rounded-xl overflow-hidden relative">
				{!conversationId && <ChatViewNew />}
				{conversationId && <ChatViewWrapper
					toggleMenu={toggleMenu}
					isMenuOpen={isMenuOpen}
					conversationId={conversationId} />}


				<div className="absolute top-0 left-0 flex flex-row gap-2 items-center ">
					{!isMenuOpen && <Button aria-label="Hide menu" onClick={toggleMenu} theme="ghost">
						<FontAwesomeIcon icon={faChevronRight} />
					</Button>}
				</div>
			</div>
		</div>
	</div>

}

const ChatWrapper: React.FC = () => {
	return <FileExplorerProvider>
		<ConversationProvider>
			<Chat />
		</ConversationProvider>
	</FileExplorerProvider>
}

export default ChatWrapper
