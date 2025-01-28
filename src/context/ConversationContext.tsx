import { createContext, useCallback, useContext, useState } from "react"
import { IConversation, IConversationChat } from "../../types/IConversation"
import ConversationService from "../services/ConversationService"
import ChatService from "../services/ChatService"


interface ConversationContextProps {
	conversation?: IConversation | null,
	chats: IConversationChat[],
	isLoading: boolean,
	actions: {
		getByConversationId: (id: number) => Promise<void>,
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
		console.log(foundChats)
		setChats(foundChats || [])
		setIsLoading(false)
	}, [isLoading])

	const chatAdd = useCallback(async (chat: Partial<IConversationChat>) => {
		if (!conversation) {
			console.warn('No conversation found')
			return
		}
		// Use the chat service to create the chat
		const fullChat: IConversationChat = {
			...chat,
			conversationId: chat.conversationId || conversation.id,
			createdAt: chat.createdAt || Date.now(),
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
		actions: {
			getByConversationId,
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
