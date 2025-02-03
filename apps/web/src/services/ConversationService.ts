import createDBService from './db'
import { IConversation } from '../../types/IConversation'

class ConversationService {
	private static dbService = createDBService<IConversation>('conversations')

	static create(chat: IConversation): Promise<IConversation & { id: number }> {
		return this.dbService.create(chat)
	}

	static update(id: number, updatedChat: Partial<IConversation>): Promise<void> {
		return this.dbService.update(id, updatedChat)
	}

	static delete(id: number): Promise<void> {
		return this.dbService.delete(id)
	}

	static getAll(): Promise<Array<IConversation & { id: number }>> {
		return this.dbService.getAll()
	}

	static getDefaults(): Promise<Array<IConversation & { id: number }>> {
		return this.dbService.getAll()
	}

	static getById(id: number): Promise<IConversation & { id: number }> {
		return this.dbService.getById(id)
	}

	static search(query: string, page: number = 1, limit: number = 10): Promise<Array<IConversation & { id: number }>> {
		return this.dbService.search(query, page, limit)
	}

}

export default ConversationService
