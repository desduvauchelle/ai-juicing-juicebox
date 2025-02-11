import { faArrowRight, faChevronDown, faChevronUp, faCog, faCopy, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useState, useEffect, useRef, FormEvent, useCallback } from "react"
import Button from "../../../components/Button"
import Textarea from "../../../components/Textarea"
import Input from "../../../components/Input"
import { useConversation } from "../../../context/ConversationContext"
import { ChatInputBox } from "./components/ChatInputBox"
import useGlobalAi from "../../../hooks/useGlobalAi"
import { IConversationChat } from "../../../../types/IConversation"
import { z } from "zod"

interface RepeaterFormData {
	prompt: string
	label: string
}

interface ResponseType {
	text: string
}


const ChatViewRepeater: FC = () => {
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats

	const [showSetup, setShowSetup] = useState(false)
	const [isDirty, setIsDirty] = useState(false)
	const [formData, setFormData] = useState<RepeaterFormData>({
		prompt: '',
		label: ""
	})
	const firstMessageSent = useRef(false)

	const [text, setText] = useState<string>('')
	const globalAi = useGlobalAi()
	const [isTyping, setIsTyping] = useState(false)

	const [shownMessage, setShownMessage] = useState<IConversationChat | undefined>(undefined)
	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)

	const [showHistory, setShowHistory] = useState(false)

	// Load initial data from first chat
	useEffect(() => {
		if (!chats?.length) return
		const firstChat = chats[0]
		if (firstChat?.data?.prompt === undefined) return
		setFormData({
			prompt: firstChat.data.prompt || '',
			label: firstChat.data.label || ''
		})
		setShowSetup(false)
		setIsDirty(false)

	}, [chats])

	// Create first message with initial data
	useEffect(() => {
		if (!conversation) return
		if (conversationContext.isLoading) return
		if (chats && chats.length > 0) return
		if (firstMessageSent.current) return
		setShowSetup(true)
		const createInitialChat = async () => {
			firstMessageSent.current = true
			await conversationContext?.actions.chat.add({
				role: "user",
				text: "Initial setup",
				data: {
					prompt: '',
					label: ''
				}
			})
		}
		createInitialChat()
	}, [conversation, conversationContext.isLoading, chats, conversationContext?.actions.chat])

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
		setIsDirty(true)
	}

	const handleSaveSetup = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!chats?.length) return

		await conversationContext?.actions.chat.update(chats[0].id, {
			data: {
				prompt: formData.prompt,
				label: formData.label
			}
		})

		setIsDirty(false)
		setShowSetup(false)
	}

	const streamCallback = useCallback((data: Partial<ResponseType>) => {
		setIncomingMessage(data.text || "")
	}, [])

	const onMessageSubmit = async (e?: FormEvent) => {
		if (e) e.preventDefault()
		if (!text.trim()) return

		if (!conversation) {
			alert("Invalid conversation")
			return
		}

		if (!conversationContext?.selectedConfig) {
			alert("Invalid config")
			return
		}

		if (!conversationContext?.conversation?.modelName) {
			alert("Invalid model")
			return
		}

		const fullMessage = await conversationContext?.actions.chat.add({
			role: "user",
			text: text
		})
		if (!fullMessage) {
			alert("Failed to send message")
			return
		}

		setShownMessage(fullMessage)


		const prompt = `${formData.prompt}
"""
${text}
"""`

		try {
			setIsTyping(true)

			const responseZod = z.object({
				text: z.string().describe("The response to the user request.")
			})

			const response = await globalAi.actions.streamObject<ResponseType>({
				aiService: conversationContext.selectedConfig,
				modelName: conversationContext.conversation.modelName,
				prompt: prompt,
				responseType: responseZod,
				streamingCallback: streamCallback
			})
			setIsTyping(false)
			setText('')
			// setIncomingMessage(undefined)
			// Update the chat with the response
			conversationContext?.actions.chat.update(fullMessage.id, {
				data: {
					...(fullMessage.data || {}),
					response: response.text
				}
			})


		} catch (error) {
			setIsTyping(false)
			// setText('')
			setShownMessage(undefined)
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}
	}
	console.log(chats)

	return <div className="w-full h-full min-h-screen overflow-y-auto">
		<div className="flex flex-col items-center justify-center space-y-6 max-w-x mx-auto py-12">

			{showSetup && <>
				<form onSubmit={handleSaveSetup} className="max-w-xl w-full flex flex-col space-y-4 p-4 rounded-xl bg-base-100">
					<Input
						label="Enter the label"
						name="label"
						value={formData.label}
						onChange={handleChange}
						placeholder="Ex: Tell me what to do..." />
					<div>
						<label htmlFor="mainPrompt" className="font-medium mb-2 block">
							Enter the main prompt
						</label>
						<Textarea
							className="textarea w-full"
							name="prompt"
							value={formData.prompt}
							onChange={handleChange}
							placeholder="Type your main prompt here..." />
					</div>
					<div className="flex flex-row gap-4 items-center">
						<Button
							type="submit"
							theme="primary"
							disabled={!isDirty}>
							Save
						</Button>
						<Button
							type="button"
							theme="ghost"
							onClick={() => {
								setShowSetup(false)
								setFormData({
									prompt: chats?.[0]?.data?.prompt || '',
									label: chats?.[0]?.data?.label || ''
								})
							}}>
							Cancel
						</Button>
					</div>
				</form>
			</>}

			{!showSetup && <>
				{!shownMessage && <>
					<form onSubmit={onMessageSubmit} className="max-w-xl w-full flex flex-col space-y-4 p-4 rounded-xl bg-base-100">
						<label htmlFor="chatInput" className="pl-1 font-medium flex-grow text-center">
							{formData.label || "Tell me what to do..."}
						</label>
						<ChatInputBox
							className="textarea w-full"
							placeholder="Type your message here..."
							startingRows={4}
							maxRows={15}
							value={text}
							onChange={(e) => setText(e.target.value)}
							onSubmit={() => {
								// Submit the message
								onMessageSubmit()
							}}
						/>
						<div className="flex flex-row justify-end gap-2 items-center">
							<Button
								theme="ghost"
								isSmall
								className="opacity-40 hover:opacity-100"
								onClick={() => setShowSetup(!showSetup)}
								type="button">
								<FontAwesomeIcon icon={faCog} /> {showSetup ? 'Hide setup' : 'Setup'}
							</Button>
							<Button
								theme="primary"
								type="submit">
								<FontAwesomeIcon icon={faArrowRight} />
							</Button>
						</div>
					</form>
				</>}

				{shownMessage && <>
					<div className="max-w-xl w-full flex flex-col space-y-4 p-4 rounded-xl bg-base-100">
						<div className="rounded-xl bg-base-300 py-4 px-6 relative pr-6">
							<p className="line-clamp-2">{shownMessage.text}</p>
							<Button
								theme="ghost"
								type="button"
								isSmall
								textToCopy={shownMessage.text}
								className="absolute top-1 right-2">
								<FontAwesomeIcon icon={faCopy} />
							</Button>
						</div>

						<div className={`markdown ${isTyping ? "animate-pulse" : ""} px-4`}>

							{shownMessage.data?.response || incomingMessage}
							{(!incomingMessage && !shownMessage.data?.response) && <>
								<FontAwesomeIcon icon={faSpinner} spin />
							</>}
						</div>

						{!isTyping && <div className="flex flex-row gap-4 items-center justify-end">
							<Button
								theme="ghost"
								type="button"
								onClick={() => {
									conversationContext?.actions.chat.delete(shownMessage.id)
									setShownMessage(undefined)
									setIncomingMessage(undefined)
								}}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
							<Button
								theme="ghost"
								type="button"
								textToCopy={shownMessage.data?.response || incomingMessage}>
								<FontAwesomeIcon icon={faCopy} /> Copy
							</Button>
							<Button
								theme="ghost"
								onClick={() => {
									setShownMessage(undefined)
									setText('')
									setIncomingMessage(undefined)
								}}>
								Restart
							</Button>
						</div>}
					</div>
				</>}

				{chats?.length > 1 && <>
					<Button
						theme="ghost"
						className="opacity-40 hover:opacity-100"
						onClick={() => setShowHistory(!showHistory)}>
						<FontAwesomeIcon icon={showHistory ? faChevronDown : faChevronUp} className="mr-2" />{showHistory ? "Hide" : "Show"} History
					</Button>
					{showHistory && <>
						{chats.slice(1).map((chat, index) => {
							return <button
								type="button"
								onClick={() => setShownMessage(chat)}
								key={chat.id} className="max-w-xl w-full flex flex-row items-center p-4 gap-4 text-left rounded-xl bg-base-100 hover:bg-base-100/40">
								<div className="flex-1">
									<p className="line-clamp-2">{chat.text}</p>
								</div>
								<div>
									<FontAwesomeIcon icon={faArrowRight} />
								</div>
								<div className="flex-1">
									<p className="line-clamp-2">{chat.data?.response}</p>
								</div>
							</button>
						})}
					</>}
				</>}

			</>}
		</div>
	</div>
}

export default ChatViewRepeater
