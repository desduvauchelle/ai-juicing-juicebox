import { IConversationChat } from '../../types/IConversation'
import createDBService from './db'

class ChatService {
	private static dbService = createDBService<IConversationChat>('chats')

	static create(chat: IConversationChat): Promise<IConversationChat & { id: number }> {
		return this.dbService.create(chat)
	}

	static update(id: number, updatedChat: Partial<IConversationChat>): Promise<void> {
		return this.dbService.update(id, updatedChat)
	}

	static delete(id: number): Promise<void> {
		return this.dbService.delete(id)
	}

	static getAll(): Promise<Array<IConversationChat & { id: number }>> {
		return this.dbService.getAll()
	}

	static getByConversationId(conversationId: number): Promise<Array<IConversationChat & { id: number }>> {
		const query = `"conversationId":${conversationId}`
		return this.dbService.search(query, 1, 50)
	}

	static getDefaults(): Promise<Array<IConversationChat & { id: number }>> {
		return this.dbService.getAll()
	}

	static getById(id: number): Promise<IConversationChat & { id: number }> {
		return this.dbService.getById(id)
	}

	static search(query: string, page: number = 1, limit: number = 10): Promise<Array<IConversationChat & { id: number }>> {
		return this.dbService.search(query, page, limit)
	}
}

export default ChatService
