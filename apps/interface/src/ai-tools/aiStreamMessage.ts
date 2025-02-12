import { streamText } from "ai"
import getAiSdk from "./aiGetSdk"
import { IConversationChat } from "../../types/IConversation"
import { IAIService } from "../../types/IAIService"



const aiStreamMessage = async ({
	chats,
	streamingCallback,
	chatHistory = 20,
	aiService,
	modelName
}: {
	chats: IConversationChat[],
	text?: string,
	systemPrompt?: string,
	streamingCallback?: (data: { fullText: string, delta: string }) => void,
	chatHistory?: number
	aiService: IAIService
	modelName: string
}): Promise<string | undefined> => {



	try {

		// const testResponse = await fetch('http://localhost:51412/ai/text', {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// 	body: JSON.stringify({
		// 		chats,
		// 		chatHistory,
		// 		aiService,
		// 		modelName
		// 	}),
		// })

		// // Stream the response to the callback
		// let streamString = ""
		// const reader = testResponse.body?.getReader()
		// if (!reader) {
		// 	throw new Error("No reader found")
		// }
		// const decoder = new TextDecoder()
		// while (true) {
		// 	const { done, value } = await reader.read()
		// 	if (done) {
		// 		break
		// 	}
		// 	streamString += decoder.decode(value)
		// 	if (streamingCallback) {
		// 		streamingCallback({
		// 			fullText: streamString,
		// 			delta: decoder.decode(value)
		// 		})
		// 	}
		// }

		// return streamString

		const sdk = getAiSdk({
			aiService,
			modelName
		})
		if (!sdk) {
			throw new Error("No SDK found")
		}

		const response = streamText({
			model: sdk,
			messages: chats.slice(-chatHistory).map(c => {
				return {
					role: c.role,
					content: c.text
				}
			}),
		})
		let streamString = ""
		for await (const textPart of response.textStream) {
			streamString += textPart
			if (streamingCallback) {
				streamingCallback({
					fullText: streamString,
					delta: textPart
				})
			}
		}

		return streamString
	} catch (error) {
		console.error(error)
	}
}

export default aiStreamMessage
