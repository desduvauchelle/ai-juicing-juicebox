import { AiService } from "../../types/IAIService"

const aiServiceProvidersList: Record<AiService, {
	name: string
	description: string
	logo: string
}> = {
	"Ollama": {
		name: "Ollama",
		description: "Run large language models locally",
		logo: "/models/ollama.svg"
	},
	"OpenAI": {
		name: "OpenAI",
		description: "Leading AI research company behind ChatGPT",
		logo: "/models/openai.svg"
	},
	"Anthropic": {
		name: "Anthropic",
		description: "AI research company focused on safe and ethical AI",
		logo: "/models/anthropic.svg"
	},
	"Google": {
		name: "Google",
		description: "Google's AI and machine learning solutions",
		logo: "/models/google.svg"
	},
	"DeepSeek": {
		name: "DeepSeek",
		description: "Advanced AI models for various applications",
		logo: "/models/dot.svg"
	},
	"Mistral": {
		name: "Mistral AI",
		description: "European AI company with powerful language models",
		logo: "/models/mistral.svg"
	},
	"xAI": {
		name: "xAI",
		description: "AI company founded by Elon Musk",
		logo: "/models/dot.svg"
	},
	"Groq": {
		name: "Groq",
		description: "High-performance AI inference platform",
		logo: "/models/groq.svg"
	},
	"Replicate": {
		name: "Replicate",
		description: "Platform for running AI models in the cloud",
		logo: "/models/dot.svg"
	},
	"OpenAI Compatible": {
		name: "OpenAI Compatible",
		description: "Services compatible with OpenAI's API",
		logo: "/models/dot.svg"
	}
}

export default aiServiceProvidersList
