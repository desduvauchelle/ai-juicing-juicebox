
export interface ILlmConfig {
	id: number
	name: string
	service: "ollama"
	url: string
	model: string
	isDefault?: boolean
}


export type OllamaModel = {
	model: string,
	name: string,
	size: number
}
