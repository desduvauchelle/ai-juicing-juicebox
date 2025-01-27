import IndexedDBService from './db'
import { IConversation } from '../../types/IConversation'

class ConversationService {
	private static dbService: IndexedDBService<IConversation> = new IndexedDBService<IConversation>('conversations')

	static createChat(chat: IConversation): Promise<IConversation & { id: IDBValidKey }> {
		return this.dbService.create(chat)
	}

	static updateChat(id: IDBValidKey, updatedChat: Partial<IConversation>): Promise<void> {
		return this.dbService.update(id, updatedChat)
	}

	static deleteChat(id: IDBValidKey): Promise<void> {
		return this.dbService.delete(id)
	}

	static getAllChats(): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getDefaults(): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getChatById(id: IDBValidKey): Promise<IConversation & { id: IDBValidKey }> {
		return this.dbService.getById(id)
	}

	static searchChats(query: string, page: number = 1, limit: number = 10): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.search(query, page, limit)
	}

}

export default ConversationService
