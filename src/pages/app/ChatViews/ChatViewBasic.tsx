import React, { useState } from 'react'
import Button from '../../../components/Button'
import { IConversation } from '../../../../types/IConversation'

const ChatViewBasic: React.FC<{
	conversation?: IConversation
}> = () => {
	const [messages, setMessages] = useState([
		{ id: 1, user: 'John', text: 'Hello there!' },
		{ id: 2, user: 'Jane', text: 'Hi, John!' },
		{ id: 3, user: 'John', text: 'How are you?' },
	])
	const [newMessage, setNewMessage] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!newMessage.trim()) return

		setMessages([
			...messages,
			{ id: messages.length + 1, user: 'Me', text: newMessage }
		])
		setNewMessage('')
	}

	return <div className="w-full max-w-3xl mx-auto h-full">
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto p-4">
				{messages.map((msg) => (
					<div key={msg.id} className="mb-2">
						<span className="font-semibold mr-1">{msg.user}:</span>
						<span>{msg.text}</span>
					</div>
				))}
			</div>

			<form onSubmit={handleSubmit} className="rounded-xl mb-2 p-4 bg-slate-400">
				<div className="flex gap-2">
					<input
						type="text"
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
