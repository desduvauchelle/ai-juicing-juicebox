import { useParams } from "react-router-dom"
import ChatViewBasic from './ChatViews/ChatViewBasic'
import { useConversation } from "../../context/ConversationContext"
import { useEffect, useRef } from "react"


const ChatViewWrapper: React.FC = () => {
	const { chatId } = useParams<{ chatId: string }>()
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const isInitiated = useRef<number | undefined>(undefined)

	useEffect(() => {
		if (!chatId) return
		if (conversationContext?.isLoading) return
		if (isInitiated.current === parseInt(chatId)) return
		conversationContext?.actions.getByConversationId(parseInt(chatId))
		isInitiated.current = parseInt(chatId)
	}, [chatId, conversationContext?.actions, conversationContext?.isLoading])

	if (conversationContext?.isLoading || conversationContext?.isLoading === undefined) {
		return <>
			Loading...
		</>
	}

	if (!conversation) {
		return <>
			Conversation not found
		</>
	}

	if (conversation.type === 'chat') {
		return <ChatViewBasic />
	}

	return <>
		VIEW NOT FOUND
	</>
}

export default ChatViewWrapper
