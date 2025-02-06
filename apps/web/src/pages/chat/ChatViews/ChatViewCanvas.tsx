import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import Textarea from '../../../components/Textarea'
import useAi from '../../../hooks/useAi'
import ChatMessage from './components/ChatMessage'
import { ChatInputBox } from './components/ChatInputBox'

const ChatViewCanvas: React.FC = () => {
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const chatWrapperRef = React.useRef<HTMLDivElement>(null)
	const ai = useAi()
	const [isTyping, setIsTyping] = useState(false)
	const isTypingRef = React.useRef(false)

	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)
	const [newMessage, setNewMessage] = useState('')
	const [canvasText, setCanvasText] = useState('')
	const [selectedText, setSelectedText] = useState('')

	useEffect(() => {
		if (!chatWrapperRef.current) return
		chatWrapperRef.current.scrollTo({
			top: chatWrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [chats, incomingMessage])

	const streamCallback = useCallback((text: string) => {
		setIncomingMessage(text)
	}, [])

	const handleCanvasSelection = () => {
		const selection = window.getSelection()
		if (!selection) return
		const text = selection.toString()
		if (text) setSelectedText(text)
	}

	const send = useCallback(async () => {
		if (isTyping || !newMessage.trim()) return
		if (isTypingRef.current) return

		const messageWithContext = selectedText
			? `Selected text: "${selectedText}"\n\nMessage: ${newMessage}`
			: newMessage

		const fullMessage = await conversationContext?.actions.chat.add({
			role: "user",
			text: messageWithContext
		})

		if (!fullMessage || !conversation || !conversationContext.selectedConfig) {
			alert("Failed to send message")
			return
		}

		try {
			setIsTyping(true)
			isTypingRef.current = true

			const response = await ai.actions.generate({
				conversation: conversation,
				config: conversationContext.selectedConfig,
				chats: [...chats, fullMessage],
				streamCallback: streamCallback
			})

			setIsTyping(false)
			isTypingRef.current = false
			setIncomingMessage(undefined)

			if (response.aiMessage) {
				await conversationContext?.actions.chat.add({
					role: "assistant",
					text: response.aiMessage.content
				})
				setNewMessage('')
				setSelectedText('')
			}
		} catch (error) {
			setIsTyping(false)
			isTypingRef.current = false
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}
	}, [isTyping, newMessage, selectedText, conversationContext, conversation, ai.actions, chats, streamCallback])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await send()
	}

	return (
		<div className="w-full h-full flex">
			{/* Left side - Chat */}
			<div className="w-2/5 flex flex-col border-r border-base-300">
				<div className="flex-1 overflow-y-auto space-y-1" ref={chatWrapperRef}>
					<div className="h-8"></div>
					{chats.map((chat) => (
						<div key={chat.id} className={`${chat.role === "user" ? "bg-base-300" : ""}`}>
							<ChatMessage chat={chat} maxWidth="max-w-full mx-4" />
						</div>
					))}
					{incomingMessage && (
						<div className="bg-base-300">
							<ChatMessage
								maxWidth="max-w-full mx-4"
								chat={{
									id: -1,
									role: "assistant",
									text: incomingMessage,
									createdAt: Date.now(),
									conversationId: conversation?.id || 0
								}}
							/>
						</div>
					)}
				</div>

				<form onSubmit={handleSubmit} className="p-4 bg-base-200">
					{selectedText && (
						<div className="mb-2 p-2 bg-base-300 rounded text-sm">
							<div className="font-semibold text-xs">Selected text:</div>
							<div className="truncate">{selectedText}</div>
						</div>
					)}
					<div className="flex gap-2">
						<ChatInputBox
							id="chat-input"
							autoFocus
							disabled={isTyping}
							maxRows={3}
							value={newMessage}
							onChange={(e) => !isTyping && setNewMessage(e.target.value)}
							className={`flex-1 px-3 py-2 border-transparent ${isTyping ? "opacity-50" : ""}`}
							placeholder="Type a message..."
							onSubmit={send}
						/>
						<Button
							type="submit"
							theme="custom"
							className='opacity-0 absolute right-0 top-0 h-0 w-0'>
							Send
						</Button>
					</div>
				</form>
			</div>

			{/* Right side - Canvas */}
			<div className="w-3/5 h-full rounded-r-6xl">
				<textarea
					value={canvasText}
					onChange={(e) => setCanvasText(e.target.value)}
					onSelect={handleCanvasSelection}
					className="w-full h-full resize-none p-4 pt-12"
					placeholder="Enter or paste your text here..."
				/>
			</div>
		</div>
	)
}

export default ChatViewCanvas
