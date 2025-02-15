import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import { useLocation, useNavigate } from 'react-router-dom'
import ChatMessage from './components/ChatMessage'
import { ChatInputBox } from './components/ChatInputBox'
import useGlobalAi from '../../../hooks/useGlobalAi'
import { faCheckCircle, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bridgeApi } from '../../../tools/bridgeApi'

const maxWidth = 'max-w-3xl w-full mx-2 lg:mx-auto'

const ChatViewImage: React.FC = () => {
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
	const [instructions, setInstructions] = useState<string>(conversation?.instruction || "")
	const [instructionSaved, setInstructionSaved] = useState(false)
	const [instructionSaving, setInstructionSaving] = useState(false)



	const [hasLoadedInitially, setHasLoadedInitially] = useState(false)

	const isNearBottom = useCallback(() => {
		if (!wrapperRef.current) return true
		const wrapper = wrapperRef.current
		const threshold = 100 // pixels from bottom
		return (wrapper.scrollHeight - wrapper.scrollTop - wrapper.clientHeight) <= threshold
	}, [])



	const scrollToBottom = useCallback(() => {
		setTimeout(() => {
			if (!wrapperRef.current) return
			wrapperRef.current.scrollTo({
				top: wrapperRef.current.scrollHeight,
				behavior: 'smooth'
			})
		}, 50)
	}, [])

	useEffect(() => {
		// Only scroll to bottom on initial load
		if (conversation && !hasLoadedInitially) {
			scrollToBottom()
			setHasLoadedInitially(true)
		}
	}, [conversation, hasLoadedInitially, scrollToBottom])

	const streamCallback = useCallback((data: {
		fullText: string,
		delta: string
	}) => {
		setIncomingMessage(data.fullText)
		// Only scroll if user is already near bottom
		if (isNearBottom()) {
			scrollToBottom()
		}
	}, [isNearBottom, scrollToBottom])

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
		chatInputRef.current?.focus()

		try {
			setIsTyping(true)
			isTypingRef.current = true
			setNewMessage('')
			// Add small delay to ensure state updates complete
			setTimeout(() => {
				chatInputRef.current?.focus()
			}, 0)

			const response = await globalAi.actions.generateImage({
				aiService: conversationContext.selectedConfig,
				modelName: conversation.modelName || '',
				prompt: messageToSend
			})
			console.log("response", response)
			isTypingRef.current = false
			setIsTyping(false)
			setIncomingMessage(undefined)


			// Add the assistant message to the chat
			// if (response) {
			// 	await conversationContext?.actions.chat.add({
			// 		role: "assistant",
			// 		text: response
			// 	})
			// 	scrollToBottom()
			// 	chatInputRef.current?.focus()
			// }
		} catch (error) {
			setIsTyping(false)
			isTypingRef.current = false
			console.error("Failed to generate AI response", error)
			if (error instanceof Error) {
				alert(error.message)
			} else {
				alert("Failed to generate AI response")
			}
		}
	}, [isTyping, newMessage, conversationContext?.actions.chat, conversationContext.selectedConfig, conversation, globalAi.actions])


	useEffect(() => {
		if (!conversation) return
		if (conversationContext.isLoading) return
		if (!location.state?.initialMessage) return
		if (initialMessageSent.current) return
		if (isTypingRef.current) return
		// Get the ID from the URL
		const urlConversationId = parseInt(location.pathname.split('/').pop() || '0')
		if (urlConversationId !== conversation.id) return
		const setup = async () => {
			initialMessageSent.current = true
			navigate(location.pathname, { replace: true })
			send(location.state.initialMessage)
		}

		setup()

	}, [conversation, conversationContext.isLoading, location.pathname, location.state, navigate, send])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await send()
	}

	const onSaveInstructions = async (e?: React.FormEvent) => {
		if (e) e.preventDefault()
		if (!conversation) return
		if (instructionSaving) return
		setInstructionSaving(true)
		await conversationContext?.actions.update({
			id: conversation.id,
			instruction: instructions
		})
		setInstructionSaving(false)
		setInstructionSaved(true)
		setTimeout(() => {
			setInstructionSaved(false)
		}, 3000)
	}

	return <div className="w-full h-full">
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-1" ref={wrapperRef}>
				<div className="h-8"></div>
				{/* <form onSubmit={onSaveInstructions} className={`${maxWidth} relative text-center text-sm text-gray-500 pb-6`}>
					<ChatInputBox
						id="chat-instruction"
						value={instructions}
						className="border-transparent text-center"
						disabled={instructionSaving}
						placeholder="Have AI improve your prompt before sending"
						onChange={(e) => setInstructions(e.target.value)}
						onSubmit={onSaveInstructions} />
					{instructionSaved && <p className="absolute bottom-0 left-0 w-full text-center italic font-medium text-success/50">
						<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
						Instruction saved
					</p>}
					{instructionSaving && <p className="absolute bottom-0 left-0 w-full text-center italic font-medium text-primary/50 animate-pulse">
						<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
						Instruction saved
					</p>}
				</form> */}
				{chats.map((chat) => {
					const isUser = chat.role === "user"
					return <div
						key={chat.id}
						className={isUser ? "pt-12" : "pt-4"}>
						<ChatMessage

							chat={chat}
							maxWidth={maxWidth} />
					</div>
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
				<div className={`${maxWidth} space-y-2`}>

					<div className="flex gap-2 bg-base-100 rounded-xl relative">
						<ChatInputBox
							id="chat-input"
							ref={chatInputRef}
							autoFocus
							// disabled={isTyping}
							maxRows={6}
							value={newMessage}
							onChange={(e) => {
								if (isTyping) return
								setNewMessage(e.target.value)
							}}
							onSubmit={async () => {
								send()
							}}
							className={`flex-1 border-transparent ${isTyping ? "opacity-50" : ""}`}
							placeholder="Type your message..."
						/>

					</div>
				</div>
			</form>
		</div>
	</div>
}

export default ChatViewImage
