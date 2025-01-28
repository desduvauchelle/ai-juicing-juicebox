import React, { useEffect, useState } from 'react'
import Button from '../../../components/Button'
import { IConversation, IConversationChat } from '../../../../types/IConversation'
import { useConversation } from '../../../context/ConversationContext'
import Textarea from '../../../components/Textarea'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const maxWidth = 'max-w-3xl mx-auto'


const ChatMessage: React.FC<{
	chat: IConversationChat
}> = ({ chat }) => {
	const conversationContext = useConversation()

	const from = chat.role === 'user' ? 'You' : 'Assistant'
	return <div className={`${maxWidth} py-4 group`}>
		<div className="flex flex-row gap-2 w-full">
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
		<p>{chat.text}</p>
	</div>
}
const ChatViewBasic: React.FC<{
	conversation?: IConversation
}> = () => {
	const conversationContext = useConversation()
	const conversation = conversationContext?.conversation
	const chats = conversationContext?.chats
	const wrapperRef = React.useRef<HTMLDivElement>(null)

	const [newMessage, setNewMessage] = useState('')

	useEffect(() => {
		// Scroll to the bottom of the chat smoothly
		if (!wrapperRef.current) return
		wrapperRef.current.scrollTo({
			top: wrapperRef.current.scrollHeight,
			behavior: 'smooth'
		})
	}, [conversationContext?.chats])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim()) return

		await conversationContext?.actions.chat.add({
			role: "user",
			text: newMessage
		})

		setNewMessage('')
		// Focus on the textarea
		const input = document.querySelector('#chat-input') as HTMLTextAreaElement
		if (!input) return
		input.focus()
	}

	return <div className="w-full h-full">
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-1" ref={wrapperRef}>
				{chats.map((chat) => {
					console.log(chat.role)
					return <div key={chat.id} className={`${maxWidth} ${chat.role === "user" ? "" : "bg-slate-500"}`}>
						<ChatMessage chat={chat} />
					</div>
				})}
			</div>

			<form onSubmit={handleSubmit} className=" p-4 bg-slate-400">
				<div className={`${maxWidth} flex gap-2`}>
					<Textarea
						id="chat-input"
						autoFocus
						maxRows={6}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						className="flex-1 px-3 py-2 border-transparent"
						placeholder="Type a message..."
					/>
					<Button
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
