

export const services = [
	"Ollama",
	"OpenAI",
	"Anthropic",
	"Google",
	"DeepSeek",
	"Mistral"
] as const
export type AiService = typeof services[number]

export interface IAIService {
	id: number
	name: string
	service: AiService
	url: string
	apiKey?: string
	isDefault?: boolean
	models?: string[]
}


export type OllamaModel = {
	model: string,
	name: string,
	size: number
}


export interface IModel {
	service: AiService,
	name: string,
	fullName?: string,
	features: {
		canStream?: boolean,
		isMultiModal?: boolean,
		hasStructuredData?: boolean,
		hasToolUse?: boolean,
		forImage?: boolean,
		forEmbedding?: boolean,
	},
	costs?: {
		tokensIn?: number,
		tokensOut?: number,
		perImage?: number,
	}
}
