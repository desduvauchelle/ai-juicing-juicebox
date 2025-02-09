import { IConversation } from "../../../types/IConversation"
import ConversationService from "../../services/ConversationService"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const mainContextActionsConversations = ({
	setConversations,
}: {
	setConversations: SetState<Array<IConversation>>,
}) => ({
	create: async (conversation: IConversation) => {
		const newConversation = await ConversationService.create(conversation)
		setConversations(prev => [newConversation, ...prev])
		return newConversation
	},

	rename: async ({ id, newName }: { id: number, newName: string }) => {
		await ConversationService.update(id, { name: newName })
		setConversations(prev => prev.map(conversation =>
			conversation.id === id
				? { ...conversation, name: newName }
				: conversation
		).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
	},

	delete: async ({ id }: { id: number }) => {
		await ConversationService.delete(id)
		setConversations(prev => prev.filter(conversation => conversation.id !== id))
	},

	update: async ({ id, partial }: { id: number, partial: Partial<IConversation> }) => {
		await ConversationService.update(id, partial)
		setConversations(prev => prev.map(conversation =>
			conversation.id === id
				? { ...conversation, ...partial }
				: conversation
		).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
	},
})

export type MainContextActionsConversations = ReturnType<typeof mainContextActionsConversations>
export default mainContextActionsConversations
