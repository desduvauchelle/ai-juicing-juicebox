import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { IConversation, IConversationChat } from "../../types/IConversation"
import ConversationService from "../services/ConversationService"
import ChatService from "../services/ChatService"
import { ILlmConfig } from "../../types/ILlmConfig"
import LlmConfigurationService from "../services/llmConfigurationService"
import { UseConfigChecker, useConfigChecker } from "../hooks/useConfigChecker"


interface ConversationContextProps {
	conversation?: IConversation | null,
	chats: IConversationChat[],
	configs: ILlmConfig[],
	selectedConfig?: ILlmConfig,
	isLoading: boolean,
	configChecker: UseConfigChecker,
	actions: {
		getByConversationId: (id: number) => Promise<void>,
		update: (override: Partial<IConversation>) => Promise<void>,
		chat: {
			add: (chat: Partial<IConversationChat>) => Promise<IConversationChat | undefined>
			delete: (id: number) => Promise<void>
		}
	}
}

const ConversationContext = createContext<ConversationContextProps | undefined>(undefined)


export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
	const [conversation, setConversation] = useState<IConversation | null>(null)
	const [chats, setChats] = useState<IConversationChat[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [configs, setConfigs] = useState<ILlmConfig[]>([])

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
			if (!conversation?.llmConfigId) return
			const allConfigs = await LlmConfigurationService.getAllConfigs()
			if (!allConfigs) return
			setConfigs(allConfigs)
		}
		fetchConfig()
	}, [conversation])

	const selectedConfig = useMemo(() => {
		if (!conversation?.llmConfigId) return undefined
		return configs.find(c => c.id === conversation.llmConfigId)
	}, [configs, conversation?.llmConfigId])
	const configChecker = useConfigChecker({ config: selectedConfig })


	const update = useCallback(async (override: Partial<IConversation>) => {
		if (!conversation) {
			console.warn('No conversation found')
			return
		}
		await ConversationService.update(conversation.id, override)

		setConversation(prev => {
			if (!prev) return null
			return {
				...prev,
				...override
			}
		})
	}, [conversation])

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

	const value: ConversationContextProps = {
		conversation,
		chats,
		isLoading,
		configs,
		selectedConfig,
		configChecker,
		actions: {
			getByConversationId,
			update,
			chat: {
				add: chatAdd,
				delete: chatRemove
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
