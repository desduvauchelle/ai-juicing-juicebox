import { IModel } from "../../../types/IAIService"

// https://mistral.ai/en/products/la-plateforme#pricing
export const mistralModelsList: IModel[] = [
	{
		service: "Mistral",
		name: "mistral-large-latest",
		displayName: "Mistral Large",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 2,   // $2/MTok
			tokensOut: 6   // $6/MTok
		}
	},
	{
		service: "Mistral",
		name: "pixtral-large-latest",
		displayName: "Pixtral Large",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 2,   // $2/MTok
			tokensOut: 6   // $6/MTok
		}
	},
	{
		service: "Mistral",
		name: "mistral-small-latest",
		displayName: "Mistral Small",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.1,  // $0.1/MTok
			tokensOut: 0.3  // $0.3/MTok
		}
	},
	{
		service: "Mistral",
		name: "codestral-latest",
		displayName: "Codestral",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.3,  // $0.3/MTok
			tokensOut: 0.9  // $0.9/MTok
		}
	},
	{
		service: "Mistral",
		name: "ministral-8b-latest",
		displayName: "Ministral 8B",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.1,  // $0.1/MTok
			tokensOut: 0.1  // $0.1/MTok
		}
	},
	{
		service: "Mistral",
		name: "ministral-3b-latest",
		displayName: "Ministral 3B",
		features: {
			hasJson: true,
			hasToolUse: true
		},
		costs: {
			tokensIn: 0.04, // $0.04/MTok
			tokensOut: 0.04 // $0.04/MTok
		}
	}
]
