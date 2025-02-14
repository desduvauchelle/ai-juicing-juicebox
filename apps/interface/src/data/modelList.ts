import { IModel } from "../../types/IAIService"
import { anthropicDefaultModelsList } from "./models/anthropic"
import { googleModelsList } from "./models/google"
import { mistralModelsList } from "./models/mistral"
import { openaiModelsList } from "./models/openAi"


const modelsList: IModel[] = [
	...anthropicDefaultModelsList,
	...openaiModelsList,
	...mistralModelsList,
	...googleModelsList,
	{
		"service": "DeepSeek",
		"name": "deepseek-chat",
		"features": {
			"hasJson": true,
			"hasToolUse": true
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
			"hasJson": true,
			"hasToolUse": true
		},
		"costs": {
			"tokensIn": 0.55,
			"tokensOut": 2.19
		}
	}
]

export default modelsList
