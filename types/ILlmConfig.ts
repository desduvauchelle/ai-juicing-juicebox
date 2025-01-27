
export interface ILlmConfig {
	id: number
	name: string
	service: "ollama"
	url: string
	model: string
	isDefault?: boolean
}
