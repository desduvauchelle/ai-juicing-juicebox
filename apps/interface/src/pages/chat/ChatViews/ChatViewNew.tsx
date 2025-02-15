import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'
import { useRef, useState, useEffect } from 'react'
import { faArrowRight, faChain, faFileLines, faGlobe, faImage, faInfinity, faRobot, faTimes, faTrash, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChatInputBox } from './components/ChatInputBox'
import { IAIService } from '../../../../types/IAIService'
import { ModalPickAiService } from '../../../ai-service/ModalPickAiService'
import { useMainContext } from '../../../context/MainContext'
import { IConversation, IConversationTypes } from '../../../../types/IConversation'

type IChatView = {
	id: number
	icon: IconDefinition
	name: string
	description: string
	type: IConversationTypes
}
const chatViewsList: IChatView[] = [
	// {
	// 	id: 1,
	// 	name: "Chat",
	// 	description: "Normal chat view",
	// 	type: "chat"
	// },
	{
		id: 2,
		name: "Co-authoring",
		icon: faFileLines,
		description: "Collaborative AI document editing. ASk AI to change all or just part of a text.",
		type: "co-authoring"
	},
	{
		id: 3,
		name: "Repeater",
		icon: faInfinity,
		description: "Same prompt everytime, perfect for customer support emails, or any task you repeat all the time.",
		type: "repeater"
	},
	// {
	// 	id: 4,
	// 	name: "Chain",
	// 	icon: faChain,
	// 	description: "Chain multiple AI requests together to a greater output.",
	// 	type: "chain"
	// },
	// {
	// 	id: 5,
	// 	name: "Image",
	// 	icon: faImage,
	// 	description: "Generate images",
	// 	type: "image"
	// },
]

const styleList = [
	"text-primary hover:border-primary",
	"text-accent hover:border-accent",
	"text-success hover:border-success",
	"text-info hover:border-info",
	"text-warning hover:border-warning",
]

const ChatViewNew: React.FC = () => {
	const navigate = useNavigate()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [selectedConfig, setSelectedConfig] = useState<number | null>(null)
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [text, setText] = useState<string>('')

	// new state to control embedded modal
	const [showAiModal, setShowAiModal] = useState<boolean>(false)
	const mainContext = useMainContext()
	const aiServices = mainContext.aiServices

	const [showUrlInput, setShowUrlInput] = useState<boolean>(false)
	const [urls, setUrls] = useState<string[]>(['']) // Changed to array with one empty string

	const currentConfig = aiServices.find((config) => config.id === selectedConfig)

	// Add useEffect to set default service on load
	useEffect(() => {
		if (selectedConfig) return
		if (aiServices.length === 0) return
		const userDefaultSettings = mainContext.userSettings?.defaultAiService
		if (!userDefaultSettings) return

		const defaultService = aiServices.find(service => service.id === userDefaultSettings.configId)
		if (defaultService) {
			setSelectedConfig(defaultService.id)
			if (userDefaultSettings.modelName) {
				setSelectedModel(userDefaultSettings.modelName)
			}
		}
	}, [aiServices, mainContext.userSettings?.defaultAiService, selectedConfig])

	const createChat = async (type: IConversationTypes) => {
		if (!selectedConfig) {
			alert("Please select a configuration")
			return
		}
		if (!text.trim() && type === "chat") {
			alert("Please enter some text")
			return
		}
		const newConversation: IConversation = {
			id: 0,
			name: text.split('\n')[0].substring(0, 50),
			aiServiceId: selectedConfig,
			modelName: selectedModel || undefined, // Add model name if selected
			instruction: "You are a helpful assistant",
			type: type || "chat",
			createdAt: Date.now(),
			updatedAt: Date.now()
		}


		try {
			const fullConversation = await mainContext.actions.conversations.create(newConversation)
			if (!fullConversation?.id) {
				alert("Failed to create chat")
				return
			}
			navigate(`/chat/${fullConversation.id}`, {
				state: {
					initialMessage: text,
					urls: urls.filter(url => url.length > 0).map(url => ({ url }))
				}
			})
		} catch (error) {
			console.error("Failed to create chat", error)
		}
	}

	const handleSubmit = (e?: React.FormEvent) => {
		if (e) e.preventDefault()
		createChat("chat")
	}

	// New handler to show the modal
	const openPicker = (e: React.MouseEvent) => {
		e.preventDefault()
		setShowAiModal(true)
	}



	const handleUrlChange = (index: number, value: string) => {
		const newUrls = [...urls]
		newUrls[index] = value

		// If the current input has content and it's the last one, add a new empty input
		if (value && index === urls.length - 1) {
			newUrls.push('')
		}

		// If the current input is empty and it's not the last one, remove it
		if (!value && index !== urls.length - 1) {
			newUrls.splice(index, 1)
		}

		setUrls(newUrls)
	}

	const removeUrl = (index: number) => {
		const newUrls = [...urls]
		newUrls.splice(index, 1)
		if (newUrls.length === 0) {
			newUrls.push('')
		}
		setUrls(newUrls)
	}

	let webButtonIsDisabled = false
	let webButtonTooltip = ''
	// @ts-expect-error I didn't type the global
	if (window.DESTINATION === 'github') {
		webButtonIsDisabled = true
		webButtonTooltip = 'This feature is disabled in the web version. Please use the desktop version.'
	}

	return <div className="w-full h-full flex flex-col items-center justify-center">
		<div className="max-w-2xl w-full mx-auto text-center space-y-6">
			<h2 className="text-2xl logo font-bold">What can I help with?</h2>
			<form onSubmit={handleSubmit} className="bg-base-100 p-6 py-4 space-y-4 rounded-xl mx-2">
				<ChatInputBox
					ref={textareaRef}
					autoFocus
					className='w-full bg-base-100 text-lg'
					placeholder='Start typing here...'
					value={text}
					tabIndex={1}
					startingRows={2}
					maxRows={10}
					onChange={(e) => setText(e.target.value)}
					onSubmit={handleSubmit}
				/>
				{showUrlInput && (
					<div className="space-y-2">
						{urls.map((url, index) => (
							<div key={index} className="flex flex-row gap-2 items-center">
								<label className="input focus:ring-0 focus:outline-none border-base-300 w-full flex items-center gap-3">
									<FontAwesomeIcon icon={faGlobe} />
									<input
										type="url"
										className="grow "
										placeholder="Enter a URL"
										value={url}
										onChange={(e) => handleUrlChange(index, e.target.value)}
									/>
								</label>
								{url.trim() && (
									<Button
										theme="custom"
										type="button"
										onClick={() => removeUrl(index)}
										className="p-2 opacity-50 hover:opacity-100 hover:text-red-400"
									>
										<FontAwesomeIcon icon={faTimes} />
									</Button>
								)}
							</div>
						))}
					</div>
				)}
				<div className="flex flex-row gap-2 items-center">
					<Button
						theme="ghost"
						type="button"
						onClick={() => setShowUrlInput(!showUrlInput)}
						tabIndex={3}
						disabled={webButtonIsDisabled}
						data-tip={webButtonTooltip}
						className="bg-base-100 flex flex-row gap-3 items-center"
					>
						<FontAwesomeIcon icon={faGlobe} />
					</Button>

					<Button theme="ghost"
						type="button"
						onClick={openPicker}
						tabIndex={3}
						className="bg-base-100 flex flex-row gap-3 items-center">
						{/* <span className="relative">
							<FontAwesomeIcon icon={faRobot} />
						</span> */}
						<span>
							{currentConfig?.name}
							{selectedModel ? ` (${selectedModel})` : ''}
							{!currentConfig && "Select AI service"}
						</span>
					</Button>

					<div className="flex-grow"></div>
					<Button theme="primary"
						tabIndex={2}
						type="submit">
						<FontAwesomeIcon icon={faArrowRight} />
					</Button>
				</div>
			</form>
			<div className='text-left'>

				<div className="flex flex-row flex-wrap gap-4">
					{chatViewsList.map((view) => {
						const iconStyle = styleList[view.id % styleList.length]
						return <button key={view.id}
							onClick={() => {
								createChat(view.type)
							}}
							data-tip={view.description}
							className={`bg-base-200 hover:bg-base-100 border-base-100 p-4 py-1 border rounded-2xl flex flex-col items-start cursor-pointer text-left tooltip tooltip-bottom ${iconStyle}`}>
							<h3>
								<FontAwesomeIcon icon={view.icon} className={`mr-2 ${iconStyle}`} />
								<span className='text-base-content'>{view.name}</span>
							</h3>
						</button>
					})}
				</div>
			</div>
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
