import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import Button from '../../../components/Button'
import { useConversation } from '../../../context/ConversationContext'
import ChatMessage from './components/ChatMessage'
import { ChatInputBox } from './components/ChatInputBox'
import useGlobalAi from '../../../hooks/useGlobalAi'
import { z } from 'zod'
import DiffView from '../../../components/DiffView'
import InlineLoader from '../../../components/InlineLoader'


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
	const chatWrapperRef = useRef<HTMLDivElement>(null)
	const globalAi = useGlobalAi()
	const [isTyping, setIsTyping] = useState(false)
	const isTypingRef = useRef(false)
	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)
	const [newMessage, setNewMessage] = useState('')
	const [canvasText, setCanvasText] = useState('')
	const [selection, setSelection] = useState<TextSelection | null>(null)
	const approveBtnRef = useRef<HTMLButtonElement>(null)
	const lastSavedText = useRef<string>('')
	const firstMessageSent = useRef(false)
	const canvasRef = useRef<HTMLTextAreaElement>(null)
	const chatInputRef = useRef<HTMLTextAreaElement>(null)
	const canvasInitiated = useRef(false)
	const [highlightedText, setHighlightedText] = useState<TextSelection | null>(null)

	const originalChat = useMemo(() => {
		return chats?.find(c => c.data?.currentText !== undefined)
	}, [chats])

	//
	// Auto save text on change with debounce
	//
	const debouncedUpdateChat = useCallback((text: string) => {
		if (!originalChat) return
		if (text === lastSavedText.current) return // Skip if no changes

		const timeoutId = setTimeout(async () => {
			await conversationContext?.actions.chat.update(originalChat.id, {
				data: {
					...originalChat.data,
					currentText: text
				}
			})
			lastSavedText.current = text
		}, 1000)

		return () => clearTimeout(timeoutId)
	}, [originalChat, conversationContext?.actions.chat])

	useEffect(() => {
		if (!originalChat) return
		const cleanup = debouncedUpdateChat(canvasText)
		return () => cleanup?.()
	}, [canvasText, debouncedUpdateChat, originalChat])


	//
	// Initial load of text
	//
	useEffect(() => {
		if (canvasInitiated.current) return
		if (!chats) return
		if (!chats.length) return
		canvasInitiated.current = true
		const firstChat = chats[0]
		setCanvasText(firstChat?.data?.currentText || "")

	}, [chats])

	//
	// Create first message with initial text
	//
	useEffect(() => {
		if (!conversation) return
		if (conversationContext.isLoading) return
		if (chats && chats.length > 0) return
		if (firstMessageSent.current) return
		const createInitialChat = async () => {
			firstMessageSent.current = true
			await conversationContext?.actions.chat.add({
				role: "user",
				text: "Initial text",
				data: {
					currentText: "",
					text: ""
				}
			})
		}
		createInitialChat()
	}, [conversation, conversationContext.isLoading, chats, conversationContext?.actions.chat])


	useEffect(() => {
		if (!chatWrapperRef.current) return
		chatWrapperRef.current.scrollTo({
			top: chatWrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [chats, incomingMessage])




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

	const streamCallback = useCallback((data: Partial<ResponseType>) => {
		setIncomingMessage(data.text || "")
	}, [])

	const send = useCallback(async () => {
		if (isTypingRef.current) return
		if (incomingMessage) return
		if (!newMessage.trim()) {
			alert("Please enter a message")
			return
		}

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

			await globalAi.actions.streamObject<ResponseType>({
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
	}, [newMessage, canvasText, selection, conversationContext?.actions.chat, conversationContext.selectedConfig, conversationContext.conversation?.modelName, conversation, globalAi.actions, streamCallback, incomingMessage])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await send()
	}

	const newText = useMemo(() => {
		if (!incomingMessage) return canvasText

		if (!selection) {
			// Replace entire text
			return incomingMessage
		}

		// Replace only selected portion
		const before = canvasText.slice(0, selection.start)
		const after = canvasText.slice(selection.end)
		return before + incomingMessage + after
	}, [incomingMessage, selection, canvasText])

	const approveEdits = async () => {
		// Update the newest message with the new text
		const lastMessage = chats[chats.length - 1]
		if (!lastMessage) return

		await conversationContext?.actions.chat.update(lastMessage.id, {
			data: {
				...lastMessage.data,
				text: newText
			}
		})
		setCanvasText(newText)
		setIncomingMessage(undefined)
		setSelection(null)
		setTimeout(() => {
			chatInputRef.current?.focus()
		}, 50)

	}

	const rejectEdits = async () => {
		setIncomingMessage(undefined)
		setSelection(null)
		chatInputRef.current?.focus()
	}

	const clearSelection = () => {
		setSelection(null)
	}

	const getHighlightedContent = (text: string) => {
		if (!highlightedText) return text
		const before = text.slice(0, highlightedText.start)
		const selected = text.slice(highlightedText.start, highlightedText.end)
		const after = text.slice(highlightedText.end)
		return <>{before}<span className="bg-primary/20">{selected}</span>{after}</>
	}

	return <div className="w-full h-full flex">
		{/* TEXT EDITOR */}
		<div className="flex-1 h-full rounded-r-6xl border-l border-base-100">
			<div className="max-w-xl mx-auto h-full">
				{incomingMessage && <>
					<div className="w-full h-full p-4 pt-12 overflow-auto">
						<DiffView
							oldText={canvasText}
							newText={newText}
						/>
					</div>
				</>}
				{!incomingMessage && <>
					<div className="relative w-full h-full">
						<div
							className="absolute inset-0 whitespace-pre-wrap p-4 pt-12"
							style={{ zIndex: 1 }}>
							{getHighlightedContent(canvasText)}
						</div>
						<textarea
							ref={canvasRef}
							value={canvasText}
							disabled={isTyping}
							onChange={(e) => {
								if (isTyping) return
								setCanvasText(e.target.value)
								if (selection) setSelection(null)
								setHighlightedText(null)
							}}
							onSelect={(e) => {
								handleCanvasSelection()
								const textArea = e.currentTarget
								setHighlightedText({
									text: textArea.value.substring(textArea.selectionStart, textArea.selectionEnd),
									start: textArea.selectionStart,
									end: textArea.selectionEnd
								})
							}}
							className="w-full h-full resize-none p-4 pt-12 focus:outline-none border-0 bg-transparent relative"
							style={{ zIndex: 2 }}
							placeholder="Enter or paste your text here..."
						/>
					</div>
				</>}
			</div>
		</div>

		{/* Left side - Chat */}
		<div className="w-[400px] min-w-[200px] max-w-[600px] flex flex-col border-r border-base-300">
			<div className="flex-1 overflow-y-auto space-y-1" ref={chatWrapperRef}>
				{chats.map((chat, index) => {
					if (index === 0) {
						return null
					}
					const isLast = index === chats.length - 1

					return <div key={chat.id} className={`pt-6`}>
						<ChatMessage chat={chat} maxWidth="max-w-full mx-4" />
						{chat.data?.text && <div className='flex flex-row justify-end pr-3 mt-1'>
							{(isLast && isTyping) && <>
								<InlineLoader />
							</>}
							<Button
								theme="ghost"
								isExtraSmall
								disabled={isTyping || canvasText === chat.data?.text || incomingMessage !== undefined}
								onClick={() => setCanvasText(chat.data?.text || "")}>
								Revert
							</Button>
						</div>}
					</div>
				})}
				{incomingMessage && <>
					<div className="flex flex-row gap-2 items-center justify-end pr-4 pt-2">
						<Button
							theme="success"
							disabled={isTyping}
							ref={approveBtnRef}
							onClick={approveEdits}>
							Approve
						</Button>
						<Button
							theme="warning"
							disabled={isTyping}
							onClick={rejectEdits}>
							Reject
						</Button>
					</div>
				</>}
				<div className="h-8"></div>
			</div>

			<form onSubmit={handleSubmit} className="p-4 bg-base-200">
				{selection && <div className="mb-2 p-2 bg-base-300 rounded text-sm">
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
				</div>}
				<div className="flex gap-2">
					<ChatInputBox
						autoFocus
						ref={chatInputRef}
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

}

export default ChatViewCoAuthor
