
import { IAIService } from "../../types/IAIService"
import getAiSdk from "./aiGetSdk"
import { experimental_generateImage as generateImage } from 'ai'
import { openai } from '@ai-sdk/openai'


/**
 * Generate an image using the specified AI model
 *
 * DOES NOT WORK, their doc is wrong
 */

export const imageSizes = ['1024x1024'] as const
export type ImageSize = typeof imageSizes[number]

export const imageAspectRatios = ['1:1', '16:9'] as const
export type ImageAspectRatio = typeof imageAspectRatios[number]

const aiGenerateImage = async ({
	aiService,
	modelName,
	prompt,
	size,
	quantity
}: {
	aiService: IAIService
	modelName: string
	prompt: string
	size?: ImageSize
	aspectRatio?: ImageAspectRatio
	quantity?: number
}) => {
	const sdk = getAiSdk({
		aiService,
		modelName
	})
	if (!sdk) {
		throw new Error("No SDK found")
	}

	// @ts-expect-error Missing type definitions
	const model = sdk.image(modelName)

	const response = await generateImage({
		model: model,
		prompt: 'Santa Claus driving a Cadillac',

	})

	return response
}


export default aiGenerateImage
