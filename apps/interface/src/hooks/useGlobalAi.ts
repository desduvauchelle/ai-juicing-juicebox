import aiGenerateImage from '../ai-tools/aiGenerateImage'
import aiStreamMessage from '../ai-tools/aiStreamMessage'
import aiStreamObject from '../ai-tools/aiStreamObject'


const useGlobalAi = () => {

	return {
		actions: {
			streamMessage: aiStreamMessage,
			streamObject: aiStreamObject,
			generateImage: aiGenerateImage
		}
	}
}

export default useGlobalAi
