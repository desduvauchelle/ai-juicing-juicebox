import { useCallback } from "react"
import { ILlmConfig, OllamaModel } from "../../../../types/ILlmConfig"
import { IConversation, IConversationChat } from "../../../../types/IConversation"


export type AIMessage = {
	role: "user" | "assistant" | "system",
	content: string,
	images: null | string[]
	toolResponse?: {
		[key: string]: string
	}
}

type OllamaChatCompletionResponse = {
	model: string,
	created_at: string,
	message: AIMessage,
	done: boolean
}


const useAi = () => {

	const fetchModels = useCallback(async ({
		config
	}: {
		config: ILlmConfig
	}): Promise<{
		success: boolean,
		message: string
		models: OllamaModel[]
	}> => {
		const url = config.url
		if (!url) {
			console.error('Invalid URL')
			return {
				success: false,
				message: 'Invalid URL',
				models: []
			}
		}
		try {
			const response = await fetch(url + '/api/tags')
			if (!response.ok) {
				console.error('Network response was not ok')
				return {
					success: false,
					message: 'Network response was not ok',
					models: []
				}
			}
			const data = await response.json()
			if (!data) {
				console.error('Invalid response (Data)')
				return {
					success: false,
					message: 'Invalid response (Data)',
					models: []
				}
			}
			if (!data.models) {
				console.error('Invalid response (Models)')
				return {
					success: false,
					message: 'Invalid response (Models)',
					models: []
				}
			}
			return {
				success: true,
				message: 'Successfully fetched models',
				models: data.models as OllamaModel[]
			}
		} catch (error) {
			console.error('Failed to fetch models', error)
			return {
				success: false,
				message: 'Failed to fetch models',
				models: []
			}
		}
	}, [])

	const generate = useCallback(async ({
		conversation,
		config,
		chats,
		streamCallback,
		chatHistory = 20
	}: {
		conversation: IConversation,
		config: ILlmConfig,
		chats: IConversationChat[],
		streamCallback?: (text: string) => unknown,
		chatHistory?: number
	}): Promise<{
		success: boolean,
		message: string,
		aiMessage?: AIMessage
	}> => {

		const allMessage: IConversationChat[] = []
		if (conversation.instruction) {
			allMessage.push({
				id: 0,
				role: 'system',
				text: conversation.instruction,
				createdAt: Date.now(),
				conversationId: conversation.id
			})
		}
		chats.splice(0, chats.length - chatHistory)
		chats.forEach((chat, index) => {
			allMessage.push({
				id: index + 1,
				role: chat.role,
				text: chat.text,
				createdAt: Date.now(),
				conversationId: conversation.id
			})
		})

		const aiChats: AIMessage[] = []
		allMessage.forEach((message) => {
			aiChats.push({
				role: message.role as "user" | "assistant" | "system",
				content: message.text,
				images: null
			})
		})

		if (!config.url) {
			console.error('Invalid URL')
			return {
				success: false,
				message: 'Invalid URL'
			}
		}
		if (!config.model) {
			console.error('Invalid Model')
			return {
				success: false,
				message: 'Invalid Model'
			}
		}
		try {
			const response = await fetch(config.url + '/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					model: config.model,
					messages: aiChats,
					stream: !!streamCallback
				})
			})

			if (!response.ok) {
				return {
					success: false,
					message: "Network response was not ok"
				}
			}

			if (!streamCallback) {
				const responseText = await response.text() // Get the raw response text

				const responseBody = JSON.parse(responseText) // Parse the raw response text as JSON
				// const toolResponse: { [key: string]: string } = {}
				// if (responseBody.message.tool_calls) {
				// 	responseBody.message.tool_calls.forEach((toolCall: any) => {
				// 		const argumentsObj = toolCall.function.arguments
				// 		for (const key in argumentsObj) {
				// 			if (argumentsObj.hasOwnProperty(key)) {
				// 				toolResponse[`${key}`] = argumentsObj[key]
				// 			}
				// 		}
				// 	})
				// }

				const aiMessage: AIMessage = {
					role: responseBody.message.role,
					content: responseBody.message.content,
					images: null,
					// toolResponse: toolResponse
				}

				return {
					success: true,
					message: "Message generated",
					aiMessage: aiMessage
				}
			}
			if (streamCallback) {
				const reader = response.body?.getReader()
				const decoder = new TextDecoder("utf-8")

				if (!reader) {
					return {
						success: false,
						message: "Failed to get reader from response body"
					}
				}

				let done = false
				let message = ""
				let finalMessage: AIMessage | undefined = undefined

				while (!done) {
					const { value, done: readerDone } = await reader.read()
					done = readerDone
					if (value) {
						message += decoder.decode(value, { stream: true })
						// Split the message by newlines to handle multiple JSON objects
						const parts = message.split("\n")
						for (let i = 0; i < parts.length - 1; i++) {
							const part = parts[i]
							if (part.trim()) {
								try {
									const parsedMessage = JSON.parse(part) as OllamaChatCompletionResponse
									if (!finalMessage) {
										finalMessage = parsedMessage.message
									} else {
										finalMessage = {
											role: parsedMessage.message.role,
											content: finalMessage.content + parsedMessage.message.content,
											images: parsedMessage.message.images
										}
									}
									if (streamCallback) {
										streamCallback(finalMessage.content)
									}
								} catch (error) {
									console.error("Failed to parse message part:", part, error)
								}
							}
						}

						// Keep the last part in the message buffer
						message = parts[parts.length - 1]
					}
				}

				return {
					success: true,
					message: "Streaming completed",
					aiMessage: finalMessage
				}
			}
			return {
				success: true,
				message: "Message generated"
			}
		} catch (error) {
			console.error('Failed to generate chat', error)
			return {
				success: false,
				message: 'Failed to generate chat'
			}
		}


	}, [])


	return {
		actions: {
			fetchModels,
			generate
		}
	}
}

export type UserAiReturn = ReturnType<typeof useAi>

export default useAi
