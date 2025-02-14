import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import { AiService, IAIService, IModel, services } from '../../types/IAIService'
import { useMainContext } from '../context/MainContext'
import { fetchOllamaModels } from '../tools/fetchOllamaModels'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { InlineAlert } from '../components/InlineAlert'


const needsUrl: AiService[] = ["Ollama", "OpenAI Compatible"]
const needsApiKey: AiService[] = ["OpenAI", "Anthropic", "Google", "DeepSeek", "Mistral", "xAI", "Groq", "Replicate"]


// @ts-expect-error - This is a global variable injected in the vite builder
const interfaceDestination = window.DESTINATION

interface AiServiceFormProps {
	initialValues?: IAIService
	afterSubmit?: () => void
	configId?: number
}

const AiServiceForm: React.FC<AiServiceFormProps> = ({ initialValues, configId, afterSubmit }) => {
	const { actions, aiServices: existingConfigs } = useMainContext()
	const [formData, setFormData] = useState<IAIService>(initialValues || {
		id: 1,
		name: '',
		service: 'Ollama',
		url: '',
		apiKey: '',
		models: []
	})
	const [isTestingConnection, setIsTestingConnection] = useState(false)
	const [testError, setTestError] = useState<string | null>(null)
	const [testSuccess, setTestSuccess] = useState<string | null>(null)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}



	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			if (configId) {
				await actions.aiServices.update({
					configId,
					updates: formData
				})
			} else {

				await actions.aiServices.create({
					...formData
				})
			}
			if (afterSubmit) afterSubmit()
		} catch (error) {
			console.error(error)
		}
	}

	const handleTestConnection = async () => {
		setIsTestingConnection(true)
		setTestError(null)
		setTestSuccess(null)

		try {
			if (!formData.url) {
				setTestError('Please enter a URL')
				return
			}
			const result = await fetchOllamaModels({ url: formData.url })
			if (!result.success) {
				setTestError(result.message)
				return
			}

			const modelList: IModel[] = result.models.map(m => ({
				name: m.name,
				service: formData.service,
				features: {} // Ensure features match the IModel interface
			}))


			setFormData(prev => ({
				...prev,
				models: modelList
			}))
			setTestSuccess(`Successfully loaded ${modelList.length} models`)
		} catch (error) {
			setTestError(error instanceof Error ? error.message : 'Failed to test connection')
		} finally {
			setIsTestingConnection(false)
		}
	}
	// console.log('IS_STATIC:', window.IS_STATIC ?? false)


	return (
		<form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-base-100 rounded space-y-4 text-left">
			{interfaceDestination === 'github' && <>
				<InlineAlert type="warning">
					<p>You are using the DEMO, your information is not stored, a page refresh will clear your configuration.</p>
				</InlineAlert>
			</>}
			<Select
				label="Service"
				name="service"
				value={formData.service}
				onChange={handleSelectChange}
				options={[
					...services.map(service => ({
						label: service,
						value: service
					}))
				]}
			/>

			{(interfaceDestination === 'github' && ["Ollama"].includes(formData.service)) && <>
				<InlineAlert type="warning">
					<p>Only localhost is enabled in DEMO. Download app to try with other URLs</p>
				</InlineAlert>
			</>}

			{needsUrl.includes(formData.service) && (
				<>
					<Input
						label="URL"
						name="url"
						type="text"
						placeholder='Ex: http://localhost:11434'
						value={formData.url}
						onChange={handleChange}
						topRight={<>
							<Button
								type="button"
								onClick={() => {
									setFormData({ ...formData, url: 'http://localhost:11434/api' })
								}}
								theme="ghost"
								isOutline
								className='btn-xs'>
								LOCAL
							</Button>
						</>}
					/>
					<div className="space-y-2">
						<Button
							type="button"
							onClick={handleTestConnection}
							isLoading={isTestingConnection}
							disabled={!formData.url}
							theme="secondary"
							className="w-full"
						>
							<FontAwesomeIcon icon={faRefresh} className="mr-2" />
							Test Connection & Load Models
						</Button>

						{testError && <InlineAlert type="error">{testError}</InlineAlert>}
						{testSuccess && <InlineAlert type="success">{testSuccess}</InlineAlert>}

						{formData.models && formData.models.length > 0 && (
							<ul className="space-y-2 max-h-60 overflow-y-auto">
								{formData.models.map(model => (
									<li key={model.name} className='w-full flex items-center gap-2 p-2 hover:bg-base-200 rounded-lg group'>
										<span className="flex-grow text-left">{model.name}</span>
										<Button
											theme="danger"
											isOutline
											isSmall
											type="button"
											className='opacity-0 group-hover:opacity-100'
											onClick={() => { }}>
											<FontAwesomeIcon icon={faTrash} />
										</Button>
									</li>
								))}
							</ul>
						)}
					</div>
				</>
			)}

			{needsApiKey.includes(formData.service) && <>
				<Input
					label="API Key"
					name="apiKey"
					type="password"
					placeholder={`Enter your ${formData.service} API key`}
					value={formData.apiKey || ''}
					onChange={handleChange}
				/>
			</>}

			<Input
				label="Name"
				name="name"
				description="Optional: Useful if you have have multiple API keys or URLs for the same service."
				placeholder='Ex: Base, ...'
				type="text"
				value={formData.name}
				onChange={handleChange}
			/>

			<div className="flex flex-row gap-4 items-center">
				<Button type="submit" theme="primary">
					Save
				</Button>
				<Button type="button" theme="primary" isOutline onClick={() => {
					if (afterSubmit) afterSubmit()
				}}>
					Cancel
				</Button>
			</div>
		</form>
	)
}

export default AiServiceForm
