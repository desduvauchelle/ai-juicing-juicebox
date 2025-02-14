export const services = [
	"Ollama",
	"OpenAI",
	"Anthropic",
	"Google",
	"DeepSeek",
	"Mistral",
	"xAI",
	"Groq",
	"Replicate",
	"OpenAI Compatible"
] as const
export type AiService = typeof services[number]

export interface IAIService {
	id: number
	name: string
	service: AiService
	url?: string
	apiKey?: string
	models?: Omit<IModel, "service">[]
}

export type OllamaModel = {
	model: string,
	name: string,
	size: number
}


export interface IModel {
	service: AiService,
	name: string,
	displayName?: string,
	isDefault?: boolean,
	features: {
		context?: number,
		hasJson?: boolean,
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
