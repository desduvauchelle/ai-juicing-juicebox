import IndexedDBService from './db'
import { IConversation } from '../../types/IConversation'

class ConversationService {
	private static dbService: IndexedDBService<IConversation> = new IndexedDBService<IConversation>('conversations')

	static create(chat: IConversation): Promise<IConversation & { id: IDBValidKey }> {
		return this.dbService.create(chat)
	}

	static update(id: IDBValidKey, updatedChat: Partial<IConversation>): Promise<void> {
		return this.dbService.update(id, updatedChat)
	}

	static delete(id: IDBValidKey): Promise<void> {
		return this.dbService.delete(id)
	}

	static getAll(): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getDefaults(): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.getAll()
	}

	static getById(id: IDBValidKey): Promise<IConversation & { id: IDBValidKey }> {
		return this.dbService.getById(id)
	}

	static search(query: string, page: number = 1, limit: number = 10): Promise<Array<IConversation & { id: IDBValidKey }>> {
		return this.dbService.search(query, page, limit)
	}

}

export default ConversationService
