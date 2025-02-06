import { useNavigate } from 'react-router-dom'
import { IConversation, IConversationTypes } from '../../../../../../types/IConversation'
import { useFileExplorer } from '../../../context/FileExplorerContext'
import Button, { MyLink } from '../../../components/Button'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ILlmConfig } from '../../../../../../types/ILlmConfig'
import LlmConfigurationService from '../../../services/llmConfigurationService'
import Textarea from '../../../components/Textarea'
import { faArrowRight, faChevronUp, faComment, faRobot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
	const fileExplorer = useFileExplorer()
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const [configs, setConfigs] = useState<Array<ILlmConfig>>([])
	const [selectedConfig, setSelectedConfig] = useState<number | null>(null)
	const isFetching = useRef<boolean>(false)
	const [text, setText] = useState<string>('')
	const [showConfigs, setShowConfigs] = useState<boolean>(false)
	const [showChatViews, setShowChatViews] = useState<boolean>(false)
	const [selectedChatView, setSelectedChatView] = useState<IChatView>(chatViewsList[0])

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true

		try {
			const allConfigs = await LlmConfigurationService.getAllConfigs()
			setConfigs(allConfigs)
			if (allConfigs.length > 0) {
				if (!selectedConfig) {
					const defaultConfig = allConfigs.find((config) => config.isDefault)
					if (defaultConfig) {
						setSelectedConfig(defaultConfig?.id)
					}
				}
			}
		} catch (error) {
			console.error('Error fetching configs:', error)
		} finally {
			isFetching.current = false
		}
	}, [selectedConfig])

	useEffect(() => {
		fetchConfigs()
	}, [fetchConfigs])


	const currentConfig = configs.find((config) => config.id === selectedConfig)


	const createChat = async (e: React.FormEvent) => {
		e.preventDefault()

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
			name: text.split('\n')[0].substring(0, 50), // Use first line as name, max 50 chars
			llmConfigId: selectedConfig,
			instruction: "You are a helpful assistant",
			type: selectedChatView.type,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}

		try {
			const fullConversation = await fileExplorer.actions.conversation.create(newConversation)
			if (!fullConversation?.id) {
				alert("Failed to create chat")
				return
			}

			navigate(`/chat/${fullConversation.id}`, {
				state: { initialMessage: text }
			})
		} catch (error) {
			console.error("Failed to create chat", error)
		}
	}

	const handleSetDefault = async (configId: number, e: React.MouseEvent) => {
		e.stopPropagation()
		try {
			await LlmConfigurationService.setDefaultConfig(configId)
			// Force update the configs state directly
			const updatedConfigs = configs.map(config => ({
				...config,
				isDefault: config.id === configId
			}))
			setConfigs(updatedConfigs)
			// Then fetch fresh data
			await fetchConfigs()
		} catch (error) {
			console.error('Error setting default config:', error)
		}
	}

	return <div className="w-full h-full flex flex-col items-center justify-center">
		<div className="max-w-2xl w-full mx-auto text-center space-y-6">
			<h2 className="text-2xl logo font-bold">What can I help with?</h2>
			<form onSubmit={createChat} className="bg-base-200 p-6 space-y-4 rounded-xl">
				<Textarea
					ref={textareaRef}
					autoFocus
					className='w-full'
					placeholder='Start typing here...'
					value={text}
					tabIndex={1}
					onChange={(e) => setText(e.target.value)} />
				<div className="flex flex-row gap-4 items-center">

					<Button theme="custom"
						onClick={(e) => {
							e.preventDefault()
							setShowConfigs(!showConfigs)
							if (showChatViews) setShowChatViews(false)
						}}
						tabIndex={3}
						className="btn text-base-200 text-sm tracking-widest font-normal bg-base-100 hover:bg-base-200 rounded-tr-3xl rounded-b-none rounded-l-none flex flex-row gap-3 items-center">

						<span className="relative">
							<FontAwesomeIcon icon={faRobot} />
						</span>
						<span>
							{currentConfig?.name || "No config"}
						</span>
					</Button>

					<Button theme="custom"
						onClick={(e) => {
							e.preventDefault()
							setShowChatViews(!showChatViews)
							if (showConfigs) setShowConfigs(false)
						}}
						tabIndex={4}
						className="btn text-base-200 text-sm tracking-widest font-normal bg-base-100 hover:bg-base-200 rounded-tr-3xl rounded-b-none rounded-l-none flex flex-row gap-3 items-center">
						<span className="relative">
							<FontAwesomeIcon icon={faComment} />
						</span>
						<span>
							{selectedChatView.name}
						</span>
					</Button>

					<div className="flex-grow"></div>
					<Button theme="light"
						tabIndex={2}
						type="submit">
						<FontAwesomeIcon icon={faArrowRight} />
					</Button>
				</div>

			</form>

			{showConfigs && <div className='text-left'>
				<div className="flex flex-row gap-2 w-full mb-2 items-center">
					<h3 className="font-xl flex-grow">Select a configuration</h3>
					<Button theme="ghost"
						aria-label="Close configurations"
						onClick={() => setShowConfigs(false)}>
						<FontAwesomeIcon icon={faChevronUp} />
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{configs.map((config) => (
						<div
							tabIndex={-1}
							key={config.id}
							className="bg-base-200 hover:bg-base-300 p-4 rounded-lg flex flex-col items-start cursor-pointer relative"
							onClick={() => {
								setSelectedConfig(config.id)
								setShowConfigs(false)
								textareaRef.current?.focus()
							}}>
							<h3 className="text-lg font-bold">{config.name}</h3>
							<p className="text-sm opacity-50 line-clamp-1">URL: {config.url}</p>
							<p className="text-sm opacity-50 line-clamp-1">Model: {config.model}</p>
							<button
								onClick={(e) => handleSetDefault(config.id, e)}
								className={`mt-2 text-xs px-2 py-1 rounded ${config.isDefault
									? 'bg-primary text-primary-content'
									: 'bg-base-300 hover:bg-base-100'
									}`}
							>
								{config.isDefault ? 'Default' : 'Set as Default'}
							</button>
						</div>
					))}
					<MyLink theme="custom"
						href="/settings/llm-configs"
						aria-label="Add an LLM config"
						className="bg-base-200 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer">
						<span className="text-2xl font-bold">+</span>
					</MyLink>
				</div>
			</div>}




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
	</div>
}

export default ChatViewNew
