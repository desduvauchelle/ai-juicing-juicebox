import { IModel } from "../../../types/IAIService"


export const googleModelsList: IModel[] = [
	{
		service: "Google",
		name: "gemini-2.0-flash-exp",
		features: {

			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.10,
			tokensOut: 0.30
		}
	},
	{
		service: "Google",
		name: "gemini-1.5-flash",
		features: {

			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.075,
			tokensOut: 0.30
		}
	},
	{
		service: "Google",
		name: "gemini-1.5-pro",
		features: {

			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 1.25,
			tokensOut: 5.00
		}
	}
]
