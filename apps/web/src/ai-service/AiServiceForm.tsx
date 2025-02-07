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
import Radio from '../components/Radio'

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

	const handleModelDefaultChange = (modelName: string) => {
		setFormData(prev => ({
			...prev,
			models: prev.models?.map(model => ({
				...model,
				isDefault: model.name === modelName
			}))
		}))
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
			if (!formData.url) {
				setTestError('Please enter a URL')
				return
			}
			const result = await fetchOllamaModels({ url: formData.url })
			if (!result.success) {
				setTestError(result.message)
				return
			}

			const modelList = result.models.map(m => ({
				name: m.name,
				isDefault: false
			}))
			// Set first model as default if no default is set
			if (modelList.length > 0) {
				modelList[0].isDefault = true
			}

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
							<ul className="space-y-2 max-h-60 overflow-y-auto">
								{formData.models.map(model => (
									<li key={model.name}>
										<button
											type="button"
											onClick={() => handleModelDefaultChange(model.name)}
											className="w-full flex items-center gap-2 p-2 hover:bg-base-200 rounded-lg">
											<Radio
												name="default-model"
												checked={!!model.isDefault}
												readOnly
												value={model.name}
												label={''} />
											<span className="flex-grow text-left">{model.name}</span>
										</button>
									</li>
								))}
							</ul>
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
