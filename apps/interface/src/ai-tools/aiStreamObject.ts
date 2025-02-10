import { DeepPartial, streamObject } from "ai"
import { IAIService } from "../../types/IAIService"
import getAiSdk from "./aiGetSdk"
import { ZodType } from "zod"


const aiStreamObject = async <T>({
	aiService,
	modelName,
	prompt,
	responseType,
	streamingCallback
}: {
	aiService: IAIService
	modelName: string
	prompt: string
	responseType: ZodType<T>
	streamingCallback?: (data: DeepPartial<T>) => void
}): Promise<T> => {
	const sdk = getAiSdk({
		aiService,
		modelName
	})
	if (!sdk) {
		throw new Error("No SDK found")
	}

	const { partialObjectStream } = streamObject({
		model: sdk,
		prompt,
		schema: responseType,
		mode: 'json'
	})

	let fullObject: DeepPartial<T> = {} as DeepPartial<T>
	for await (const partialObject of partialObjectStream) {
		fullObject = partialObject
		if (streamingCallback) {
			streamingCallback(partialObject)
		}
	}

	return fullObject as T
}

export default aiStreamObject
