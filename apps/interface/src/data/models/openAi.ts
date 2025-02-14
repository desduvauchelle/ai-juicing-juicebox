import { IModel } from "../../../types/IAIService"

export const openaiModelsList: IModel[] = [
	{
		service: "OpenAI",
		name: "gpt-4o",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.015,
			tokensOut: 0.06
		}
	},
	{
		service: "OpenAI",
		name: "gpt-4o-mini",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.01,
			tokensOut: 0.03
		}
	},
	{
		service: "OpenAI",
		name: "gpt-4-turbo",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.03,
			tokensOut: 0.06
		}
	},
	{
		service: "OpenAI",
		name: "gpt-4",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.03,
			tokensOut: 0.06
		}
	},
	{
		service: "OpenAI",
		name: "o3-mini",
		features: {
			hasJson: false,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.01,
			tokensOut: 0.04
		}
	},
	{
		service: "OpenAI",
		name: "o1",
		features: {
			hasJson: false,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.02,
			tokensOut: 0.08
		}
	},
	{
		service: "OpenAI",
		name: "o1-mini",
		features: {
			hasJson: false,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.01,
			tokensOut: 0.04
		}
	}
]
