import { IModel } from "../../types/IAIService"

const modelsList: IModel[] = [
	{
		"service": "OpenAI",
		"name": "gpt-4o",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.015,
			"tokensOut": 0.06
		}
	},
	{
		"service": "OpenAI",
		"name": "gpt-4o-mini",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.01,
			"tokensOut": 0.03
		}
	},
	{
		"service": "OpenAI",
		"name": "gpt-4-turbo",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.03,
			"tokensOut": 0.06
		}
	},
	{
		"service": "OpenAI",
		"name": "gpt-4",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.03,
			"tokensOut": 0.06
		}
	},
	{
		"service": "OpenAI",
		"name": "o3-mini",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": false,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.01,
			"tokensOut": 0.04
		}
	},
	{
		"service": "OpenAI",
		"name": "o1",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": false,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.02,
			"tokensOut": 0.08
		}
	},
	{
		"service": "OpenAI",
		"name": "o1-mini",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": false,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.01,
			"tokensOut": 0.04
		}
	},
	{
		"service": "OpenAI",
		"name": "o1-preview",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": false,
			"hasToolUse": false,
			"canStream": false
		},
		"costs": {
			"tokensIn": 0.015,
			"tokensOut": 0.06
		}
	},
	{
		"service": "Anthropic",
		"name": "claude-3-5-sonnet-20241022",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.003,
			"tokensOut": 0.015
		}
	},
	{
		"service": "Anthropic",
		"name": "claude-3-5-sonnet-20240620",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.003,
			"tokensOut": 0.015
		}
	},
	{
		"service": "Anthropic",
		"name": "claude-3-5-haiku-20241022",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.0008,
			"tokensOut": 0.004
		}
	},
	{
		"service": "Mistral",
		"name": "pixtral-large-latest",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.001,
			"tokensOut": 0.005
		}
	},
	{
		"service": "Mistral",
		"name": "mistral-large-latest",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.009,
			"tokensOut": 0.004
		}
	},
	{
		"service": "Mistral",
		"name": "mistral-small-latest",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.003,
			"tokensOut": 0.002
		}
	},
	{
		"service": "Mistral",
		"name": "pixtral-12b-2409",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.001,
			"tokensOut": 0.005
		}
	},
	{
		"service": "Google",
		"name": "gemini-2.0-flash-exp",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.10,
			"tokensOut": 0.30
		}
	},
	{
		"service": "Google",
		"name": "gemini-1.5-flash",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.075,
			"tokensOut": 0.30
		}
	},
	{
		"service": "Google",
		"name": "gemini-1.5-pro",
		"features": {
			"isMultiModal": true,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 1.25,
			"tokensOut": 5.00
		}
	},
	{
		"service": "DeepSeek",
		"name": "deepseek-chat",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.20,
			"tokensOut": 0.60
		}
	},
	{
		"service": "DeepSeek",
		"name": "deepseek-reasoner",
		"features": {
			"isMultiModal": false,
			"hasStructuredData": true,
			"hasToolUse": true,
			"canStream": true
		},
		"costs": {
			"tokensIn": 0.55,
			"tokensOut": 2.19
		}
	}

]

export default modelsList
