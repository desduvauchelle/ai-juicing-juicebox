import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import ChatMessage from './components/ChatMessage'
import { ChatInputBox } from './components/ChatInputBox'
import useGlobalAi from '../../../hooks/useGlobalAi'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import DiffView from '../../../components/DiffView'


type ResponseType = {
	text: string
}

type TextSelection = {
	text: string
	start: number
	end: number
}

const ChatViewCoAuthor: React.FC = () => {
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const chatWrapperRef = React.useRef<HTMLDivElement>(null)
	const globalAi = useGlobalAi()
	const [isTyping, setIsTyping] = useState(false)
	const isTypingRef = React.useRef(false)
	const initialMessageSent = React.useRef(false)
	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)
	const [newMessage, setNewMessage] = useState('')
	const [canvasText, setCanvasText] = useState('')
	const [selection, setSelection] = useState<TextSelection | null>(null)
	const location = useLocation()
	const navigate = useNavigate()
	const approveBtnRef = React.useRef<HTMLButtonElement>(null)

	useEffect(() => {
		if (!chatWrapperRef.current) return
		chatWrapperRef.current.scrollTo({
			top: chatWrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [chats, incomingMessage])

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
		// send(location.state.initialMessage)
		const setInitialMessage = async () => {
			await conversationContext?.actions.chat.add({
				role: "user",
				text: "Init text",
				data: {
					text: location.state.initialMessage
				}
			})
		}
		setCanvasText(location.state.initialMessage)
		setInitialMessage()

	}, [conversation, conversationContext?.actions.chat, conversationContext.isLoading, location.pathname, location.state?.initialMessage, navigate, newMessage])

	useEffect(() => {
		if (!chats?.length) return
		if (canvasText) return // Don't override if we already have text

		// Find the oldest message (first message in the conversation)
		const orderedChats = chats.filter(c => c.data?.text !== undefined).sort((a, b) => b.createdAt - a.createdAt)
		const oldestMessage = orderedChats[0]
		if (!oldestMessage?.data?.text) return

		setCanvasText(oldestMessage.data.text)

	}, [chats, canvasText])

	const streamCallback = useCallback((data: Partial<ResponseType>) => {
		setIncomingMessage(data.text || "")
	}, [])

	const handleCanvasSelection = () => {
		const textArea = document.querySelector('textarea')
		if (!textArea) return

		const start = textArea.selectionStart
		const end = textArea.selectionEnd
		const text = textArea.value.substring(start, end)

		if (text) {
			setSelection({ text, start, end })
		} else {
			setSelection(null)
		}
	}

	const send = useCallback(async () => {
		if (isTyping || !newMessage.trim()) return
		if (isTypingRef.current) return

		let contextText = canvasText
		if (contextText.length > 3000) {
			// Truncate to -1500 characters from the selection and +1500 characters from the selection
			const selectionStart = selection?.start || 0
			const selectionEnd = selection?.end || 0
			const start = Math.max(0, selectionStart - 1500)
			const end = Math.min(contextText.length, selectionEnd + 1500)
			contextText = contextText.substring(start, end)
		}

		const prompt = `You are an expert copywriter helping the user change their text.

Here is the text or a segment of their text:
<original_text>
${canvasText}
</original_text>

${selection && `
The user wants to change this part of the text and only this part:
<selected_text>
${selection.text}
</selected_text>

`}

Here is their messages on the edits they would like:
<user_message>
${newMessage}
</user_message>

Your task is to help the user change the text to match their message.
${selection && `You change edit and return only the selected text of the user, nothing else.`}

`


		const fullMessage = await conversationContext?.actions.chat.add({
			role: "user",
			text: newMessage
		})

		if (!fullMessage || !conversation || !conversationContext.selectedConfig) {
			alert("Failed to send message")
			return
		}
		if (!conversationContext.conversation?.modelName) {
			alert("Invalid conversation")
			return
		}

		try {
			setIsTyping(true)
			isTypingRef.current = true

			const responseZod = z.object({
				text: z.string().describe("The edited text based on the user request.")
			})

			globalAi.actions.streamObject<ResponseType>({
				aiService: conversationContext.selectedConfig,
				modelName: conversationContext.conversation.modelName,
				prompt: prompt,
				responseType: responseZod,
				streamingCallback: streamCallback
			})

			setIsTyping(false)
			isTypingRef.current = false
			setNewMessage('')
			// setIncomingMessage(undefined)

			setTimeout(() => {
				// Scroll to bottom of chat
				chatWrapperRef.current?.scrollTo({
					top: chatWrapperRef.current.scrollHeight,
					behavior: 'smooth'
				})

				approveBtnRef.current?.focus()
			}, 100)

		} catch (error) {
			setIsTyping(false)
			isTypingRef.current = false
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}
	}, [isTyping, newMessage, canvasText, selection, conversationContext?.actions.chat, conversationContext.selectedConfig, conversationContext.conversation?.modelName, conversation, globalAi.actions, streamCallback])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await send()
	}

	const approveEdits = async () => {
		setIncomingMessage(undefined)
		// Update the newest message with the new text
		const newText = computeNewText()
		const lastMessage = chats[chats.length - 1]
		if (!lastMessage) return
		const updatedMessage = { ...lastMessage }
		updatedMessage.data = { text: newText }
		setCanvasText(newText)
		await conversationContext?.actions.chat.update(lastMessage.id, {
			data: updatedMessage.data
		})
		setSelection(null)
		document.querySelector('textarea')?.focus()
	}

	const rejectEdits = async () => {
		setIncomingMessage(undefined)
		setSelection(null)
		document.querySelector('textarea')?.focus()
	}

	const clearSelection = () => {
		setSelection(null)
	}

	const computeNewText = () => {
		if (!incomingMessage) return canvasText

		if (!selection) {
			// Replace entire text
			return incomingMessage
		}

		// Replace only selected portion
		const before = canvasText.slice(0, selection.start)
		const after = canvasText.slice(selection.end)
		return before + incomingMessage + after
	}

	return (
		<div className="w-full h-full flex">
			{/* TEXT EDITOR */}
			<div className="flex-1 h-full rounded-r-6xl border-l border-base-100">
				<div className="max-w-xl mx-auto h-full">
					{incomingMessage && <>
						<div className="w-full h-full p-4 pt-12 overflow-auto">
							<DiffView
								oldText={canvasText}
								newText={computeNewText()}
							/>
						</div>
					</>}
					{!incomingMessage && <>
						<textarea
							value={canvasText}
							disabled={isTyping}
							onChange={(e) => {
								if (isTyping) return
								setCanvasText(e.target.value)
								if (selection) setSelection(null)
							}}
							onSelect={handleCanvasSelection}
							className="w-full h-full resize-none p-4 pt-12 focus:outline-none border-0"
							placeholder="Enter or paste your text here..."
						/>
					</>}
				</div>
			</div>

			{/* Left side - Chat */}
			<div className="w-[400px] min-w-[200px] max-w-[600px] flex flex-col border-r border-base-300">
				<div className="flex-1 overflow-y-auto space-y-1" ref={chatWrapperRef}>
					{chats.map((chat) => (
						<div key={chat.id} className={`pt-6`}>
							<ChatMessage chat={chat} maxWidth="max-w-full mx-4" />
							{chat.data?.text && <div className='flex flex-row justify-end pr-3 mt-1'>
								<Button
									theme="ghost"
									isExtraSmall
									onClick={() => setCanvasText(chat.data?.text || "")}>
									Revert
								</Button>
							</div>}
						</div>
					))}
					{incomingMessage && <>
						<div className="flex flex-row gap-2 items-center justify-end pr-4 pt-2">
							<Button
								theme="success"
								ref={approveBtnRef}
								onClick={approveEdits}>
								Approve
							</Button>
							<Button
								theme="warning"
								onClick={rejectEdits}>
								Reject
							</Button>
						</div>
					</>}
					<div className="h-8"></div>
				</div>

				<form onSubmit={handleSubmit} className="p-4 bg-base-200">
					{selection && (
						<div className="mb-2 p-2 bg-base-300 rounded text-sm">
							<div className="flex flex-row items-center">
								<div className="font-semibold text-xs flex-grow">
									Selected text (pos: {selection.start}-{selection.end}):
								</div>
								<Button
									theme="custom"
									isOutline
									isSmall
									className='text-xs py-0 px-1 border rounded-xl hover:bg-accent'
									onClick={clearSelection}>
									Clear
								</Button>
							</div>
							<div className="truncate">{selection.text}</div>
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


		</div>
	)
}

export default ChatViewCoAuthor
