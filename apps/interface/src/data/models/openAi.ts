import { IModel } from "../../../types/IAIService"

//https://openai.com/api/pricing/
export const openaiModelsList: IModel[] = [
	{
		service: "OpenAI",
		name: "o1",
		displayName: "OpenAI O1",
		features: {
			hasJson: true,
			hasToolUse: true,
			// hasVision: true,
			context: 200000
		},
		costs: {
			tokensIn: 15,   // $15/MTok
			tokensOut: 60   // $60/MTok
		}
	},
	{
		service: "OpenAI",
		name: "o3-mini",
		displayName: "OpenAI O3 Mini",
		features: {
			hasJson: true,
			hasToolUse: true,
			// hasCode: true,
			context: 200000
		},
		costs: {
			tokensIn: 1.1,  // $1.10/MTok
			tokensOut: 4.4  // $4.40/MTok
		}
	},
	{
		service: "OpenAI",
		name: "gpt-4o",
		displayName: "GPT-4O",
		features: {
			hasJson: true,
			hasToolUse: true,
			context: 128000
		},
		costs: {
			tokensIn: 2.5,  // $2.50/MTok
			tokensOut: 10   // $10/MTok
		}
	},
	{
		service: "OpenAI",
		name: "gpt-4o-mini",
		displayName: "GPT-4O Mini",
		features: {
			hasJson: true,
			hasToolUse: true,
			context: 128000
		},
		costs: {
			tokensIn: 0.15, // $0.15/MTok
			tokensOut: 0.6  // $0.60/MTok
		}
	}
]
