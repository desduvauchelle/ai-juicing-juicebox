import { OllamaModel } from "../../types/IAIService"

export async function fetchOllamaModels({
	url
}: {
	url: string
}): Promise<{
	success: boolean,
	message: string,
	models: OllamaModel[]
}> {
	if (!url) {
		console.error('Invalid URL')
		return {
			success: false,
			message: 'Invalid URL',
			models: []
		}
	}
	try {
		const response = await fetch(url + '/tags')
		if (!response.ok) {
			console.error('Network response was not ok')
			return {
				success: false,
				message: 'Network response was not ok',
				models: []
			}
		}
		const data = await response.json()
		if (!data) {
			console.error('Invalid response (Data)')
			return {
				success: false,
				message: 'Invalid response (Data)',
				models: []
			}
		}
		if (!data.models) {
			console.error('Invalid response (Models)')
			return {
				success: false,
				message: 'Invalid response (Models)',
				models: []
			}
		}
		return {
			success: true,
			message: 'Successfully fetched models',
			models: data.models as OllamaModel[]
		}
	} catch (error) {
		console.error('Failed to fetch models', error)
		return {
			success: false,
			message: 'Failed to fetch models',
			models: []
		}
	}
}
