import { IModel } from "../../../types/IAIService"


export const mistralModelsList: IModel[] = [
	{
		"service": "Mistral",
		"name": "pixtral-large-latest",
		"features": {

			"hasJson": true,
			"hasToolUse": true
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
			"hasJson": true,
			"hasToolUse": true
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
			"hasJson": true,
			"hasToolUse": true
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

			"hasJson": true,
			"hasToolUse": true
		},
		"costs": {
			"tokensIn": 0.001,
			"tokensOut": 0.005
		}
	}
]
