import { IModel } from "../../../types/IAIService"

// https://www.anthropic.com/pricing#anthropic-api
export const anthropicDefaultModelsList: IModel[] = [
	{
		service: "Anthropic",
		name: "claude-3-5-haiku-20241022",
		displayName: "Claude 3.5 Haiku ($)",
		features: {
			hasJson: true,
			hasToolUse: true,
			context: 200_000
		},
		costs: {
			tokensIn: 0.80,  // $0.80/MTok
			tokensOut: 4  // $4/MTok
		}
	},
	{
		service: "Anthropic",
		name: "claude-3-5-sonnet-20241022",
		displayName: "Claude 3.5 Sonnet ($$)", //  (New)
		features: {
			hasJson: true,
			hasToolUse: true,
			context: 200_000
		},
		costs: {
			tokensIn: 3,  // $3/MTok
			tokensOut: 15  // $15/MTok
		}
	},

	{
		service: "Anthropic",
		name: "claude-3-opus-20240229",
		displayName: "Claude 3 Opus ($$$)",
		features: {
			hasJson: true,
			hasToolUse: true,
			context: 200_000
		},
		costs: {
			tokensIn: 15,   // $15/MTok
			tokensOut: 75   // $75/MTok
		}
	},
	// {
	// 	service: "Anthropic",
	// 	name: "claude-3-5-sonnet-20240620",
	// 	displayName: "Claude 3.5 Sonnet (Old)",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true,
	// 		context: 200_000
	// 	},
	// 	costs: {
	// 		tokensIn: 0.000003,  // $3/MTok
	// 		tokensOut: 0.000015  // $15/MTok
	// 	}
	// },
	// {
	// 	service: "Anthropic",
	// 	name: "claude-3-haiku-20240307",
	// 	displayName: "Claude 3 Haiku",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true,
	// 		context: 200_000
	// 	},
	// 	costs: {
	// 		tokensIn: 0.0000008,  // $0.80/MTok
	// 		tokensOut: 0.000004   // $4/MTok
	// 	}
	// },
	// {
	// 	service: "Anthropic",
	// 	name: "claude-3-opus-20240229",
	// 	displayName: "Claude 3 Opus",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true,
	// 		context: 200_000
	// 	},
	// 	costs: {
	// 		tokensIn: 0.000015,   // $15/MTok
	// 		tokensOut: 0.000075   // $75/MTok
	// 	}
	// },
	// {
	// 	service: "Anthropic",
	// 	name: "claude-3-sonnet-20240229",
	// 	displayName: "Claude 3 Sonnet",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true,
	// 		context: 200_000
	// 	},
	// 	costs: {
	// 		tokensIn: 0.000003,  // $3/MTok
	// 		tokensOut: 0.000015  // $15/MTok
	// 	}
	// },
	// {
	// 	service: "Anthropic",
	// 	name: "claude-2.1",
	// 	displayName: "Claude 2.1",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true
	// 	},
	// 	costs: {
	// 		tokensIn: 0.000008,  // $8/MTok
	// 		tokensOut: 0.000024  // $24/MTok
	// 	}
	// },
	// {
	// 	service: "Anthropic",
	// 	name: "claude-2.0",
	// 	displayName: "Claude 2.0",
	// 	features: {
	// 		hasJson: true,
	// 		hasToolUse: true
	// 	},
	// 	costs: {
	// 		tokensIn: 0.000008,  // $8/MTok
	// 		tokensOut: 0.000024  // $24/MTok
	// 	}
	// }
]
