import { streamText } from 'ai'
import { createOllama } from 'ollama-ai-provider'
import { useCallback } from 'react'
import { IConversationChat } from '../../types/IConversation'

const ollama = createOllama({
	// optional settings, e.g.
	baseURL: 'http://127.0.0.1:11434/api',
})

const ollamaLlama31 = ollama("llama3.1:latest")

type AIMessage = {
	role: "user" | "assistant" | "system",
	content: string,
}

const useGlobalAi = () => {

	const streamMessage = useCallback(async ({
		chats,
		streamingCallback,
		chatHistory = 20
	}: {
		chats: IConversationChat[],
		text?: string,
		systemPrompt?: string,
		streamingCallback?: (data: { fullText: string, delta: string }) => void,
		chatHistory?: number
	}): Promise<string | undefined> => {

		const selectedMessages: AIMessage[] = []
		if (chats) {
			chats.splice(0, chats.length - chatHistory)
			chats.forEach((chat) => {
				selectedMessages.push({
					role: chat.role,
					content: chat.text
				})
			})

		}

		try {
			const response = streamText({
				model: ollamaLlama31,
				messages: selectedMessages,
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
	}, [])


	return {
		actions: {
			streamMessage
		}
	}
}

export default useGlobalAi
