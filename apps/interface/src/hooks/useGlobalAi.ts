import { LanguageModelV1, streamText } from 'ai'
import { useCallback } from 'react'
import { IConversationChat } from '../../types/IConversation'
import { IAIService } from '../../types/IAIService'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createMistral } from '@ai-sdk/mistral'
import { createXai } from '@ai-sdk/xai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createGroq } from '@ai-sdk/groq'
import { createReplicate } from '@ai-sdk/replicate'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'




type AIMessage = {
	role: "user" | "assistant" | "system",
	content: string,
}

const getSdk = ({
	aiService,
	modelName
}: {
	aiService?: IAIService
	modelName: string
}): LanguageModelV1 | null => {

	switch (aiService?.service) {
		case "Ollama": {
			if (!aiService.url) {
				throw new Error("No Ollama URL found")
			}
			const ollama = createOllama({
				baseURL: aiService.url
			})
			return ollama(modelName)
		}
		case "OpenAI": {
			if (!aiService.apiKey) {
				throw new Error("No OpenAI API key found")
			}
			const openai = createOpenAI({
				apiKey: aiService.apiKey,
				// custom settings, e.g.
				compatibility: 'strict', // strict mode, enable when using the OpenAI API
			})
			return openai(modelName)
		}
		case "Anthropic": {
			if (!aiService.apiKey) {
				throw new Error("No Anthropic URL found")
			}
			const anthropic = createAnthropic({
				apiKey: aiService.apiKey
			})
			return anthropic(modelName)
		}
		case "Google": {
			if (!aiService.apiKey) {
				throw new Error("No Google API key found")
			}
			const google = createGoogleGenerativeAI({
				apiKey: aiService.apiKey
			})
			return google(modelName)
		}
		case "Mistral": {
			const mistral = createMistral({
				apiKey: aiService.apiKey
			})
			return mistral(modelName)
		}
		case "xAI": {
			const xai = createXai({
				apiKey: aiService.apiKey
			})
			return xai(modelName)
		}
		case "DeepSeek": {
			const deepSeek = createDeepSeek({
				apiKey: aiService.apiKey
			})
			return deepSeek(modelName)
		}
		case "Groq": {
			const groq = createGroq({
				apiKey: aiService.apiKey
			})
			return groq(modelName)
		}
		case "Replicate": {
			if (!aiService.apiKey) {
				throw new Error("No Replicate API key found")
			}
			const replicate = createReplicate({
				apiToken: aiService.apiKey,
				baseURL: aiService.url
			})
			throw new Error("Replicate not implemented")
			// return replicate(modelName)
		}
		case "OpenAI Compatible": {
			if (!aiService.url) {
				throw new Error("No OpenAI Compatible API key found")
			}
			const openaiCompatible = createOpenAICompatible({
				apiKey: aiService.apiKey,
				baseURL: aiService.url,
				name: ''
			})
			return openaiCompatible(modelName)
		}
		default:
			return null
	}
}

const useGlobalAi = () => {

	const streamMessage = useCallback(async ({
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

			const sdk = getSdk({
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
	}, [])


	return {
		actions: {
			streamMessage
		}
	}
}

export default useGlobalAi
