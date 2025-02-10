import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { IConversation, IConversationChat } from "../../../../types/IConversation"
import ConversationService from "../services/ConversationService"
import ChatService from "../services/ChatService"
import LlmConfigService from "../services/AiServiceService"
import { UseConfigChecker, useConfigChecker } from "../hooks/useConfigChecker"
import { useMainContext } from "./MainContext"
import useGlobalAi from "../hooks/useGlobalAi"
import { IAIService } from "../../types/IAIService"


interface ConversationContextProps {
	conversation?: IConversation | null,
	chats: IConversationChat[],
	selectedConfig?: IAIService,
	isLoading: boolean,
	configChecker: UseConfigChecker,
	actions: {
		getByConversationId: (id: number) => Promise<void>,
		update: (override: Partial<IConversation>) => Promise<void>,
		chat: {
			add: (chat: Partial<IConversationChat>) => Promise<IConversationChat | undefined>
			delete: (id: number) => Promise<void>
			update: (id: number, chat: Partial<IConversationChat>) => Promise<void>
		}
	}
}

const ConversationContext = createContext<ConversationContextProps | undefined>(undefined)


export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
	const [conversation, setConversation] = useState<IConversation | null>(null)
	const [chats, setChats] = useState<IConversationChat[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [configs, setConfigs] = useState<IAIService[]>([])
	const isGeneratingTitleRef = useRef(false)
	const mainContext = useMainContext()
	const globalAi = useGlobalAi()

	const getByConversationId = useCallback(async (id: number) => {

		if (isLoading) return
		setIsLoading(true)
		const foundConversation = await ConversationService.getById(id)
		if (!foundConversation) {
			setIsLoading(false)
			setConversation(null)
			setChats([])
			return
		}
		setConversation(foundConversation)

		const foundChats = await ChatService.getByConversationId(id)
		setChats(foundChats || [])
		setIsLoading(false)
	}, [isLoading])

	useEffect(() => {
		const fetchConfig = async () => {
			if (!conversation?.aiServiceId) return
			const allConfigs = await LlmConfigService.getAllConfigs()
			if (!allConfigs) return
			setConfigs(allConfigs)
		}
		fetchConfig()
	}, [conversation])

	const selectedConfig = useMemo(() => {
		if (!conversation?.aiServiceId) return undefined
		return configs.find(c => c.id === conversation.aiServiceId)
	}, [configs, conversation?.aiServiceId])
	const configChecker = useConfigChecker({ config: selectedConfig })


	const update = useCallback(async (override: Partial<IConversation>) => {
		if (!conversation) {
			console.warn('No conversation found')
			return
		}
		await ConversationService.update(override?.id || conversation.id, override)
		// mainContext.actions.folders.refresh()
		setConversation(prev => {
			if (!prev) return null
			return {
				...prev,
				...override
			}
		})
	}, [conversation])

	useEffect(() => {
		if (isGeneratingTitleRef.current) return
		if (conversation?.aiGeneratedTitle) return
		if (chats.length < 2) return

		if (!conversation?.aiServiceId) return
		if (!selectedConfig) return
		if (!conversation.modelName) return
		const generateTitle = async () => {
			if (isGeneratingTitleRef.current) return
			isGeneratingTitleRef.current = true
			if (!conversation.modelName) return
			const titleResponse = await globalAi.actions.streamMessage({
				aiService: selectedConfig,
				modelName: conversation.modelName,
				chats: [
					{
						role: "system", text: "You are an expert at finding titles for conversations",
						id: 0,
						createdAt: 0,
						conversationId: 0
					},
					{ role: "user", text: `I need a title for this conversation, it needs to concise and descriptive. <chats>${chats.map(c => { return `<chat><from>${c.role}</from><messages>${c.text}</message></chat>` })}</chats>  Just give me the title and nothing else. No quotes, no mention of "Title", just the title. Be strict with yourself.`, id: 1, conversationId: conversation.id, createdAt: Date.now() },
				]
			})
			isGeneratingTitleRef.current = false
			if (titleResponse) {
				const title = titleResponse
					.replace(/<think>[\s\S]*?<\/think>/g, '')
					.trim()
					.replace(/["']/g, '')
					.replace(/[*_`#]/g, '')
					.trim()
				if (!title) return
				await update({
					id: conversation.id,
					name: title,
					aiGeneratedTitle: true
				})
				mainContext.actions.conversations.update({
					id: conversation.id,
					partial: {
						name: title,
						aiGeneratedTitle: true
					}
				})
			}
		}

		generateTitle()
	}, [conversation, selectedConfig, chats, update, globalAi.actions, mainContext.actions.conversations])

	const chatAdd = useCallback(async (chat: Partial<IConversationChat>) => {
		if (!conversation) {
			console.warn('No conversation found')
			return
		}
		// Use the chat service to create the chat
		const fullChat: IConversationChat = {
			...chat,
			conversationId: chat.conversationId || conversation.id,
			createdAt: Date.now(),
			id: 0,
			role: chat.role || "user",
			text: chat.text || ""
		}
		if (!chat.conversationId) {
			chat.conversationId = conversation.id
		}
		if (!chat.createdAt) {
			chat.createdAt = Date.now()
		}
		const createdChat = await ChatService.create(fullChat)
		if (!createdChat) {
			console.warn('Failed to create chat')
			return
		}
		setChats(prev => [...prev, createdChat])
		return createdChat
	}, [conversation])

	const chatRemove = useCallback(async (id: number) => {
		const chat = chats.find(chat => chat.id === id)
		if (!chat) {
			console.warn('Chat not found')
			return
		}
		await ChatService.delete(id)
		setChats(prev => prev.filter(chat => chat.id !== id))
	}, [chats])

	const chatUpdate = useCallback(async (id: number, chat: Partial<IConversationChat>) => {
		const existingChat = chats.find(chat => chat.id === id)
		if (!existingChat) {
			console.warn('Chat not found')
			return
		}
		await ChatService.update(id, chat)
		setChats(prev => prev.map(chat => chat.id === id ? { ...chat, ...chat } : chat))
	}, [chats])

	const value: ConversationContextProps = {
		conversation,
		chats,
		isLoading,
		selectedConfig,
		configChecker,
		actions: {
			getByConversationId,
			update,
			chat: {
				add: chatAdd,
				delete: chatRemove,
				update: chatUpdate
			}
		}
	}
	return <ConversationContext.Provider value={value}>
		{children}
	</ConversationContext.Provider>
}


export const useConversation = () => {
	const context = useContext(ConversationContext)
	if (context === undefined) {
		throw new Error('useConversation must be used within a ConversationProvider')
	}
	return context
}
