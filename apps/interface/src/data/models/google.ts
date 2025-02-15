import { IModel } from "../../../types/IAIService"

// https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models
// https://cloud.google.com/vertex-ai/generative-ai/pricing#gemini-models
// THIS ONE: https://ai.google.dev/pricing?_gl=1*10jodqw*_ga*MjAxMDA5OTg1NS4xNzM4NjAxOTU0*_ga_P1DBVKWT6V*MTczOTU3NzE1NC41LjEuMTczOTU3ODI5My41Ny4wLjg5MzM1OTk1OQ..#1_5flash-8B

export const googleModelsList: IModel[] = [
	{
		service: "Google",
		name: "gemini-2.0-flash",
		displayName: "Gemini 2.0 Flash",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.15,    // $0.15/MTok
			tokensOut: 1     // $0.60/MTok
		}
	},
	// {
	// 	service: "Google",
	// 	name: "gemini-2.0-flash-lite",
	// 	displayName: "Gemini 2.0 Flash Lite",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true
	// 	},
	// 	costs: {
	// 		tokensIn: 0.075,   // $0.075/MTok
	// 		tokensOut: 0.30     // $0.30/MTok
	// 	}
	// },
	{
		service: "Google",
		name: "gemini-1.5-flash",
		features: {

			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0,
			tokensOut: 0
		}
	},
	// {
	// 	service: "Google",
	// 	name: "gemini-1.5-flash-8b",
	// 	features: {

	// 		hasJson: true,
	// 		hasToolUse: true
	// 	},
	// 	costs: {
	// 		tokensIn: 0,
	// 		tokensOut: 0
	// 	}
	// },
	{
		service: "Google",
		name: "gemini-1.5-pro",
		features: {

			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0,
			tokensOut: 0
		}
	},
	// {
	// 	service: "Google",
	// 	name: "imagegen-3.0",
	// 	features: {

	// 		hasJson: true,
	// 		hasToolUse: true
	// 	},
	// 	costs: {
	// 		perImage: 0.03
	// 	}
	// },
	{
		service: "Google",
		name: "imagegen-3.0",
		features: {

			forImage: true,
		},
		costs: {
			perImage: 0.03
		}
	}
]
