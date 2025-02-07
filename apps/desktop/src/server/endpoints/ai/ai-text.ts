import { streamText } from 'ai'
import { z } from 'zod'
// import getAiSdk from '../../server-tools/getAiSdk'
import { IAIService } from 'types/IAIService'

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
import { LanguageModelV1 } from 'ai'



const getAiSdk = ({
	aiService,
	modelName
}: {
	aiService?: Omit<IAIService, "id">
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

const ChatSchema = z.object({
	role: z.string(),
	text: z.string()
})

const AIServiceSchema = z.object({
	name: z.string(),
	service: z.enum(["Ollama", "OpenAI", "Anthropic", "Google", "DeepSeek", "Mistral", "xAI", "Groq", "Replicate", "OpenAI Compatible"]),
	apiKey: z.string().optional(),
	url: z.string().optional()
}) satisfies z.ZodType<Omit<IAIService, "id">>

const RequestBodySchema = z.object({
	chats: z.array(ChatSchema),
	chatHistory: z.number().default(20),
	aiService: AIServiceSchema,
	modelName: z.string()
})


const aiAiText = async (req: any, res: any) => {
	try {
		const validatedBody = RequestBodySchema.parse(req.body)
		const {
			chats,
			chatHistory,
			aiService,
			modelName
		} = validatedBody

		const sdk = getAiSdk({
			aiService,
			modelName
		})
		if (!sdk) {
			throw new Error("No SDK found")
		}

		// Set headers for streaming
		res.writeHead(200, {
			'Content-Type': 'text/plain',
			'Transfer-Encoding': 'chunked'
		})

		const response = streamText({
			model: sdk,
			messages: chats.slice(-chatHistory).map(c => ({
				role: c.role as 'user' | 'assistant' | 'system',
				content: c.text
			})),
		})

		// Pipe the raw stream directly to response
		for await (const chunk of response.textStream) {
			res.write(chunk)
		}
		res.end()

	} catch (error) {
		if (error instanceof z.ZodError) {
			res.statusCode = 400
			res.end(JSON.stringify({
				error: 'Invalid request data',
				details: error.errors
			}))
			return
		}
		console.error(error)
		res.statusCode = 500
		res.end(JSON.stringify({ error: (error as Error).message }))
	}
}

export default aiAiText
