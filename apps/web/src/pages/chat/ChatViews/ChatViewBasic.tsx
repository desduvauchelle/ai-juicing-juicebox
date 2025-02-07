import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatMessage from './components/ChatMessage'
import { ChatInputBox } from './components/ChatInputBox'
import useGlobalAi from '../../../hooks/useGlobalAi'

const maxWidth = 'max-w-3xl mx-auto'

const ChatViewBasic: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const wrapperRef = React.useRef<HTMLDivElement>(null)
	const globalAi = useGlobalAi()
	const [isTyping, setIsTyping] = useState(false)
	const isTypingRef = React.useRef(false)
	const chatInputRef = React.useRef<HTMLTextAreaElement>(null)

	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)
	const initialMessageSent = React.useRef(false)

	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		// Scroll to the bottom of the chat smoothly
		if (!wrapperRef.current) return
		wrapperRef.current.scrollTo({
			top: wrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [conversationContext?.chats, incomingMessage])

	const streamCallback = useCallback((data: {
		fullText: string,
		delta: string
	}) => {
		setIncomingMessage(data.fullText)
	}, [])

	const send = useCallback(async (messageOverride?: string) => {
		if (isTyping) return
		if (isTypingRef.current) return
		const messageToSend = messageOverride || newMessage
		if (!messageToSend.trim()) return

		const fullMessage = await conversationContext?.actions.chat.add({
			role: "user",
			text: messageToSend
		})
		if (!fullMessage) {
			alert("Failed to send message")
			return
		}
		if (!conversation) {
			alert("Invalid conversation")
			return
		}
		if (!conversationContext.selectedConfig) {
			alert("Invalid config")
			return
		}
		try {

			setIsTyping(true)
			isTypingRef.current = true
			setNewMessage('')
			// Add small delay to ensure state updates complete
			setTimeout(() => {
				chatInputRef.current?.focus()
			}, 0)

			const response = await globalAi.actions.streamMessage({
				aiService: conversationContext.selectedConfig,
				modelName: conversation.modelName || '',
				text: messageToSend,
				chats: [
					...chats,
					fullMessage
				],
				streamingCallback: streamCallback
			})
			isTypingRef.current = false
			setIsTyping(false)
			setIncomingMessage(undefined)


			// Add the assistant message to the chat
			if (response) {
				await conversationContext?.actions.chat.add({
					role: "assistant",
					text: response
				})
			}
		} catch (error) {
			setIsTyping(false)
			isTypingRef.current = false
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}
	}, [isTyping, newMessage, conversationContext?.actions.chat, conversationContext.selectedConfig, conversation, globalAi.actions, chats, streamCallback])

	useEffect(() => {
		if (!conversation) return
		if (conversationContext.isLoading) return
		if (!location.state?.initialMessage) return
		if (initialMessageSent.current) return
		if (isTypingRef.current) return
		// Get the ID from the URL
		const urlConversationId = parseInt(location.pathname.split('/').pop() || '0')
		if (urlConversationId !== conversation.id) return
		initialMessageSent.current = true
		navigate(location.pathname, { replace: true })
		send(location.state.initialMessage)

	}, [conversation, conversationContext.isLoading, location.pathname, location.state, navigate, send])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await send()
	}

	return <div className="w-full h-full">
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-1" ref={wrapperRef}>
				<div className="h-8"></div>
				{chats.map((chat) => {
					return <ChatMessage
						key={chat.id}
						chat={chat}
						maxWidth={maxWidth} />
				})}
				{(incomingMessage || isTyping) && <>
					<ChatMessage
						maxWidth={maxWidth}
						chat={{
							id: -1,
							role: "assistant",
							text: incomingMessage || "",
							createdAt: Date.now(),
							conversationId: conversation?.id || 0
						}} />
				</>}
				{!conversationContext.selectedConfig && <p className='text-red-500 text-center'>
					No config
				</p>}
				<div className="h-12"></div>

			</div>

			<form onSubmit={handleSubmit} className="py-4 relative">

				<div className={`${maxWidth} flex gap-2 bg-base-100 rounded-xl`}>
					<ChatInputBox
						id="chat-input"
						ref={chatInputRef}
						autoFocus
						disabled={isTyping}
						maxRows={6}
						value={newMessage}
						onChange={(e) => {
							if (isTyping) return
							setNewMessage(e.target.value)
						}}
						onSubmit={send}
						className={`flex-1 border-transparent ${isTyping ? "opacity-50" : ""}`}
						placeholder="Type your message..."
					/>
					<Button
						isLoading={isTyping}
						type="submit"
						theme="custom"
						className="absolute right-2 top-2 opacity-0">
						Send
					</Button>
				</div>
			</form>
		</div>
	</div>
}

export default ChatViewBasic
