import { IConversationChat } from '../../types/IConversation'
import IndexedDBService from './db'

class ChatService {
	private static dbService: IndexedDBService<IConversationChat> = new IndexedDBService<IConversationChat>('chats')

	static create(chat: IConversationChat): Promise<IConversationChat & { id: IDBValidKey }> {
		return this.dbService.create(chat)
	}

	static update(id: IDBValidKey, updatedChat: Partial<IConversationChat>): Promise<void> {
		return this.dbService.update(id, updatedChat)
	}

	static delete(id: IDBValidKey): Promise<void> {
		return this.dbService.delete(id)
	}

	static getAll(): Promise<Array<IConversationChat & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getByConversationId(conversationId: IDBValidKey): Promise<Array<IConversationChat & { id: IDBValidKey }>> {
		const query = `"conversationId":${conversationId}`
		return this.dbService.search(query, 1, 50)
	}

	static getDefaults(): Promise<Array<IConversationChat & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getById(id: IDBValidKey): Promise<IConversationChat & { id: IDBValidKey }> {
		return this.dbService.getById(id)
	}

	static search(query: string, page: number = 1, limit: number = 10): Promise<Array<IConversationChat & { id: IDBValidKey }>> {
		return this.dbService.search(query, page, limit)
	}
}

export default ChatService
