import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import Textarea from '../../../components/Textarea'
import useAi from '../../../hooks/useAi'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatMessage from './components/ChatMessage'

const maxWidth = 'max-w-3xl mx-auto'

const ChatViewBasic: React.FC = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const wrapperRef = React.useRef<HTMLDivElement>(null)
	const ai = useAi()
	const [isTyping, setIsTyping] = useState(false)
	const isTypingRef = React.useRef(false)

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

	const streamCallback = useCallback((text: string) => {
		setIncomingMessage(text)
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
			const response = await ai.actions.generate({
				conversation: conversation,
				config: conversationContext.selectedConfig,
				chats: [
					...chats,
					fullMessage
				],
				streamCallback: streamCallback
			})
			setIsTyping(false)
			isTypingRef.current = false
			setIncomingMessage(undefined)
			// Add the assistant message to the chat
			if (response.aiMessage) {
				await conversationContext?.actions.chat.add({
					role: "assistant",
					text: response.aiMessage.content
				})
				setNewMessage('')
			}

			// Focus on the textarea
			const input = document.querySelector('#chat-input') as HTMLTextAreaElement
			if (!input) return
			input.focus()
		} catch (error) {
			setIsTyping(false)
			isTypingRef.current = false
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}
	}, [isTyping, newMessage, conversationContext?.actions.chat, conversationContext.selectedConfig, conversation, ai.actions, chats, streamCallback])

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
					return <div key={chat.id} className={`${chat.role === "user" ? "bg-base-200 bg-opacity-70" : ""}`}>
						<ChatMessage chat={chat} maxWidth={maxWidth} />
					</div>
				})}
				{incomingMessage && <div className={`bg-base-200 bg-opacity-70`}>
					<ChatMessage
						maxWidth={maxWidth}
						chat={{
							id: -1,
							role: "assistant",
							text: incomingMessage,
							createdAt: Date.now(),
							conversationId: conversation?.id || 0
						}} />
				</div>}
				{!conversationContext.selectedConfig && <p className='text-red-500'>
					No config
				</p>}
			</div>

			<form onSubmit={handleSubmit} className=" p-4 bg-base-200">
				<div className={`${maxWidth} flex gap-2`}>
					<Textarea
						id="chat-input"
						autoFocus
						disabled={isTyping}
						maxRows={6}
						value={newMessage}
						onChange={(e) => {
							if (isTyping) return
							setNewMessage(e.target.value)
						}}
						className={`flex-1 px-3 py-2 border-transparent ${isTyping ? "opacity-50" : ""}`}
						placeholder="Type a message..."
					/>
					<Button
						isLoading={isTyping}
						type="submit"
						theme="primary">
						Send
					</Button>
				</div>
			</form>
		</div>
	</div>
}

export default ChatViewBasic
