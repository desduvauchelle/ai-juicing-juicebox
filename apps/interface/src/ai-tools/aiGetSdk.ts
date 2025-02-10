import { createAnthropic } from "@ai-sdk/anthropic"
import { createDeepSeek } from "@ai-sdk/deepseek"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createGroq } from "@ai-sdk/groq"
import { createMistral } from "@ai-sdk/mistral"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { createReplicate } from "@ai-sdk/replicate"
import { createXai } from "@ai-sdk/xai"
import { LanguageModelV1 } from "ai"
import { createOllama } from "ollama-ai-provider"
import { IAIService } from "../../types/IAIService"

const getAiSdk = ({
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

export default getAiSdk
