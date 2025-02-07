import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import { IAIService, services } from '../../types/IAIService'
import { useMainContext } from '../context/MainContext'
import { fetchOllamaModels } from '../tools/fetchOllamaModels'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { InlineAlert } from '../components/InlineAlert'

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
				// Check if this is the first config for this service
				const isFirstForService = !existingConfigs.some(
					config => config.service === formData.service
				)

				await actions.aiServices.create({
					...formData,
					isDefault: isFirstForService
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
			const result = await fetchOllamaModels({ url: formData.url })
			if (!result.success) {
				setTestError(result.message)
				return
			}

			const modelNames = result.models.map(m => m.name)
			setFormData(prev => ({
				...prev,
				models: modelNames
			}))
			setTestSuccess(`Successfully loaded ${modelNames.length} models`)
		} catch (error) {
			setTestError(error instanceof Error ? error.message : 'Failed to test connection')
		} finally {
			setIsTestingConnection(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-base-100 rounded space-y-4 text-left">
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

			{formData.service === 'Ollama' && (
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
							<div className="flex flex-wrap gap-2">
								{formData.models.map(model => (
									<span key={model} className="badge badge-primary">{model}</span>
								))}
							</div>
						)}
					</div>
				</>
			)}

			{formData.service !== 'Ollama' && <>
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

			<Button type="submit" theme="primary">
				Save
			</Button>
		</form>
	)
}

export default AiServiceForm
