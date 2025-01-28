

const chatTypes = ["chat"] as const // eslint-disable-line @typescript-eslint/no-unused-vars
export type IConversationTypes = typeof chatTypes[number]

export type IConversationChat = {
	id: number
	role: "user" | "system" | "assistant"
	text: string
	createdAt: number
	conversationId: number
}

export interface IConversation {
	id: number
	name: string
	folderId?: number
	type: IConversationTypes
	llmConfigId: number
	instruction?: string
	createdAt: number
	updatedAt: number
	order?: number
}
