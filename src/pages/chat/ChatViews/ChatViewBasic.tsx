import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { IConversation, IConversationChat } from '../../../../types/IConversation'
import { useConversation } from '../../../context/ConversationContext'
import Textarea from '../../../components/Textarea'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAi from '../../../hooks/useAi'
import LlmConfigurationService from '../../../services/llmConfigurationService'
import { ILlmConfig } from '../../../../types/ILlmConfig'
import Markdown from '../../../components/Markdown'

const maxWidth = 'max-w-3xl mx-auto'


const ChatMessage: React.FC<{
	chat: IConversationChat
}> = ({ chat }) => {
	const conversationContext = useConversation()

	const from = chat.role === 'user' ? 'You' : 'Assistant'
	return <div className={`${maxWidth} py-4 group`}>
		<div className="flex flex-row gap-2 w-full break-words">
			<p className="font-bold flex-grow w-full">{from}</p>
			<Button
				theme="danger"
				isOutline
				isSmall
				className="opacity-0 group-hover:opacity-100"
				onClick={() => conversationContext?.actions.chat.delete(chat.id)}>
				<FontAwesomeIcon icon={faTrash} />
			</Button>
		</div>
		<Markdown>{chat.text}</Markdown>
	</div>
}
const ChatViewBasic: React.FC<{
	conversation?: IConversation
}> = () => {
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const wrapperRef = React.useRef<HTMLDivElement>(null)
	const ai = useAi()

	const [config, setConfig] = useState<ILlmConfig | undefined>(undefined)
	const [incomingMessage, setIncomingMessage] = useState<string | undefined>(undefined)

	useEffect(() => {
		const fetchConfig = async () => {
			if (!conversation?.llmConfigId) return
			const allConfigs = await LlmConfigurationService.getAllConfigs()
			if (!allConfigs) return
			const foundConfig = allConfigs.find(c => c.id === conversation?.llmConfigId)
			setConfig(foundConfig)
		}
		fetchConfig()
	}, [conversation])

	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		// Scroll to the bottom of the chat smoothly
		if (!wrapperRef.current) return
		wrapperRef.current.scrollTo({
			top: wrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [conversationContext?.chats, incomingMessage])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!newMessage.trim()) return

		const fullMessage = await conversationContext?.actions.chat.add({
			role: "user",
			text: newMessage
		})
		if (!fullMessage) {
			alert("Failed to send message")
			return
		}
		if (!conversation) {
			alert("Invalid conversation")
			return
		}
		if (!config) {
			alert("Invalid config")
			return
		}
		try {
			const response = await ai.actions.generate({
				conversation: conversation,
				config: config,
				chats: [
					...chats,
					fullMessage
				],
				streamCallback: (text) => {
					setIncomingMessage(text)
				}
			})
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
			console.error("Failed to generate AI response", error)
			alert("Failed to generate AI response")
		}



	}

	return <div className="w-full h-full">
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-1" ref={wrapperRef}>
				{chats.map((chat) => {
					return <div key={chat.id} className={`${chat.role === "user" ? "" : "bg-base-300"}`}>
						<ChatMessage chat={chat} />
					</div>
				})}
				{incomingMessage && <div className={`bg-base-300`}>
					<ChatMessage chat={{
						id: -1,
						role: "assistant",
						text: incomingMessage,
						createdAt: Date.now(),
						conversationId: conversation?.id || 0
					}} />
				</div>}
				{!config && <p className='text-red-500'>
					No config
				</p>}
			</div>

			<form onSubmit={handleSubmit} className=" p-4 bg-base-200">
				<div className={`${maxWidth} flex gap-2`}>
					<Textarea
						id="chat-input"
						autoFocus
						disabled={!config || incomingMessage !== undefined}
						maxRows={6}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className="flex-1 px-3 py-2 border-transparent"
						placeholder="Type a message..."
					/>
					<Button
						isLoading={incomingMessage !== undefined}
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
