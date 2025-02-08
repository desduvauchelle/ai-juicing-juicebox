import { useNavigate } from 'react-router-dom'
import { IConversation, IConversationTypes } from '../../../../../../types/IConversation'
import Button from '../../../components/Button'
import { useRef, useState, useEffect } from 'react'
import { faArrowRight, faChevronUp, faComment, faRobot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChatInputBox } from './components/ChatInputBox'
import { IAIService } from '../../../../types/IAIService'
import { ModalPickAiService } from '../../../ai-service/ModalPickAiService'
import { useMainContext } from '../../../context/MainContext'

type IChatView = {
	id: number
	name: string
	description: string
	type: IConversationTypes
}
const chatViewsList: IChatView[] = [
	{
		id: 1,
		name: "Chat",
		description: "Normal chat view",
		type: "chat"
	},
	{
		id: 2,
		name: "Co-authoring",
		description: "Collaborative document editing",
		type: "co-authoring"
	}
]

const ChatViewNew: React.FC = () => {
	const navigate = useNavigate()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [selectedConfig, setSelectedConfig] = useState<number | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [text, setText] = useState<string>('')
	const [showChatViews, setShowChatViews] = useState<boolean>(false)
	const [selectedChatView, setSelectedChatView] = useState<IChatView>(chatViewsList[0])
	// new state to control embedded modal
	const [showAiModal, setShowAiModal] = useState<boolean>(false)
	const mainContext = useMainContext()
	const aiServices = mainContext.aiServices

	const currentConfig = aiServices.find((config) => config.id === selectedConfig)

	// Add useEffect to set default service on load
	useEffect(() => {
		if (!selectedConfig && aiServices.length > 0) {
			// Try to find a default service
			const defaultService = aiServices.find(service => service.isDefault)
			if (defaultService) {
				setSelectedConfig(defaultService.id)
				// If it's an Ollama service with models, select the default model
				if (defaultService.service === 'Ollama' && defaultService.models?.length) {
					const defaultModel = defaultService.models.find(m => m.isDefault)
					if (defaultModel) {
						setSelectedModel(defaultModel.name)
					}
				}
			} else {
				// If no default, just use the first service
				setSelectedConfig(aiServices[0].id)
			}
		}
	}, [aiServices, selectedConfig])

	const createChat = async (e?: React.FormEvent) => {
		if (e) e.preventDefault()
		if (!selectedConfig) {
			alert("Please select a configuration")
			return
		}
		if (!text.trim()) {
			alert("Please enter some text")
			return
		}
		const newConversation: IConversation = {
			id: 0,
			name: text.split('\n')[0].substring(0, 50),
			aiServiceId: selectedConfig,
			modelName: selectedModel || undefined, // Add model name if selected
			instruction: "You are a helpful assistant",
			type: selectedChatView.type,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}
		try {
			const fullConversation = await mainContext.actions.conversations.create(newConversation)
			if (!fullConversation?.id) {
				alert("Failed to create chat")
				return
			}
			navigate(`/chat/${fullConversation.id}`, { state: { initialMessage: text } })
		} catch (error) {
			console.error("Failed to create chat", error)
		}
	}

	// New handler to show the modal
	const openPicker = (e: React.MouseEvent) => {
		e.preventDefault()
		setShowAiModal(true)
	}

	return <div className="w-full h-full flex flex-col items-center justify-center">
		<div className="max-w-2xl w-full mx-auto text-center space-y-6">
			<h2 className="text-2xl logo font-bold">What can I help with?</h2>
			<form onSubmit={createChat} className="bg-base-100 p-6 py-4 space-y-4 rounded-xl mx-2">
				<ChatInputBox
					ref={textareaRef}
					autoFocus
					className='w-full bg-base-100 text-lg'
					placeholder='Start typing here...'
					value={text}
					tabIndex={1}
					startingRows={2}
					onChange={(e) => setText(e.target.value)}
					onSubmit={createChat}
				/>
				<div className="flex flex-row gap-4 items-center">
					<Button theme="ghost"
						type="button"
						onClick={openPicker}
						tabIndex={3}
						className="bg-base-100 flex flex-row gap-3 items-center">
						<span className="relative">
							<FontAwesomeIcon icon={faRobot} />
						</span>
						<span>
							{currentConfig?.name}
							{selectedModel ? ` (${selectedModel})` : ''} {/* Show selected model */}
						</span>
					</Button>
					<Button theme="custom"
						onClick={(e) => {
							e.preventDefault()
							setShowChatViews(!showChatViews)
						}}
						tabIndex={4}
						className="bg-base-100 flex flex-row gap-3 items-center">
						<span className="relative">
							<FontAwesomeIcon icon={faComment} />
						</span>
						<span>{selectedChatView.name}</span>
					</Button>
					<div className="flex-grow"></div>
					<Button theme="primary"
						tabIndex={2}
						type="submit">
						<FontAwesomeIcon icon={faArrowRight} />
					</Button>
				</div>
			</form>
			{showChatViews && <div className='text-left'>
				<div className="flex flex-row gap-2 w-full mb-2 items-center">
					<h3 className="font-xl flex-grow">Select a chat view</h3>
					<Button theme="ghost"
						aria-label="Close chat views"
						onClick={() => {
							setShowChatViews(false)

						}}>
						<FontAwesomeIcon icon={faChevronUp} />
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{chatViewsList.map((view) => (
						<button key={view.id}
							onClick={() => {
								setSelectedChatView(view)
								setShowChatViews(false)
								textareaRef.current?.focus()
							}}
							className="bg-base-200 hover:bg-base-300 p-4 rounded-lg flex flex-col items-start cursor-pointer text-left">
							<h3 className="text-lg font-black">{view.name}</h3>
							<p className="text-sm opacity-50">{view.description}</p>
						</button>
					))}
				</div>
			</div>}
		</div>
		{/* Inline embedded modal */}
		<ModalPickAiService
			isOpen={showAiModal}
			onSelect={(service: IAIService, modelName?: string) => {
				setSelectedConfig(service.id)
				setSelectedModel(modelName || null)
				setShowAiModal(false)
			}}
			onCancel={() => setShowAiModal(false)}
		/>
	</div>
}

export default ChatViewNew
