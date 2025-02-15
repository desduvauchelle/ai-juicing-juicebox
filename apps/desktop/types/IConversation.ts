

const chatTypes = ["chat", "co-authoring", "playground", "repeater", "chain", "image"] as const // eslint-disable-line @typescript-eslint/no-unused-vars
export type IConversationTypes = typeof chatTypes[number]

export type IConversationChat = {
	id: number
	role: "user" | "system" | "assistant"
	text: string
	createdAt: number
	conversationId: number
	data?: {
		// For URL
		url?: {
			url: string
			content?: string
		},
		// For co-authoring
		currentText?: string
		text?: string
		// For repeater
		label?: string
		prompt?: string
		response?: string
		// For images
		image?: string
	}
}

export interface IConversation {
	id: number
	name: string
	folderId?: number
	type: IConversationTypes
	aiServiceId: number
	modelName?: string
	instruction?: string
	createdAt: number
	updatedAt: number
	order?: number
	aiGeneratedTitle?: boolean

}
