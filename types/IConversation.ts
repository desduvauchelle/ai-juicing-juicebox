

const chatTypes = ["chat"] as const // eslint-disable-line @typescript-eslint/no-unused-vars
export type IConversationTypes = typeof chatTypes[number]

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
