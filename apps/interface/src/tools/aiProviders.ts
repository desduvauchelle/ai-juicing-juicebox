import { anthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai'




const createUserRegistry = () => {
	const registry = createProviderRegistry({
		// register provider with prefix and default setup:
		anthropic,

		// register provider with prefix and custom setup:
		openai: createOpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		}),
	})
}
