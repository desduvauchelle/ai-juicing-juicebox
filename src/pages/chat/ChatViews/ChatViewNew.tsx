import { useNavigate } from 'react-router-dom'
import { IConversation, IConversationTypes } from '../../../../types/IConversation'
import { useFileExplorer } from '../../../context/FileExplorerContext'
import Button from '../../../components/Button'

const chatViewsList: {
	id: number
	name: string
	description: string
	type: IConversationTypes
}[] = [
		{
			id: 1,
			name: "Chat",
			description: "Normal chat view",
			type: "chat"
		}
	]

const ChatViewNew: React.FC = () => {
	const navigate = useNavigate()
	const fileExplorer = useFileExplorer()

	const createChat = async (id: number) => {
		const current = chatViewsList.find((view) => view.id === id)
		if (!current) {
			alert("Invalid chat view")
			return
		}
		const newChat: IConversation = {
			id: 0,
			name: "",
			llmConfigId: 1,
			instruction: "You are a helpful assistant",
			type: current.type,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}

		try {
			const fullChat = await fileExplorer.actions.conversation.create(newChat)
			if (!fullChat?.id) {
				alert("Failed to create chat")
				return
			}
			navigate(`/chat/${fullChat.id}`)
		} catch (error) {
			console.error("Failed to create chat", error)
		}
	}

	return <div className="w-full h-full flex flex-col items-center justify-center">
		<h2 className="text-xl">NEW CHAT</h2>
		<div className="w-1/2 mt-4">
			{chatViewsList.map((view) => (
				<div key={view.id} className="bg-slate-600 p-4 rounded-lg mb-4 flex items-center justify-between">
					<div>
						<h3 className="text-lg">{view.name}</h3>
						<p className="text-sm ">{view.description}</p>
					</div>
					<Button theme="dark" onClick={() => {
						createChat(view.id)
					}}>Use</Button>
				</div>
			))}
		</div>
	</div>
}

export default ChatViewNew
