import React, { useState, useEffect } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import LlmConfigService from '../services/LlmConfigService'
import Select from '../components/Select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import useAi from '../hooks/useAi'
import { ILlmConfig, OllamaModel } from '../../types/ILlmConfig'

interface LlmConfigFormProps {
	initialValues?: ILlmConfig
	onSubmit?: (cfg: ILlmConfig) => void
	configId?: number
}

const LlmConfigForm: React.FC<LlmConfigFormProps> = ({ initialValues, configId, onSubmit }) => {
	const [formData, setFormData] = useState<ILlmConfig>(initialValues || {
		id: 1,
		name: '',
		service: 'ollama',
		url: '',
		model: ''
	})
	const [models, setModels] = useState<OllamaModel[]>([])
	const [isLoadingModels, setIsLoadingModels] = useState(false)
	const [loadingModelsError, setLoadingModelsError] = useState<string | null>(null)
	const ai = useAi()

	useEffect(() => {
		if (!configId) return

		const fetchConfig = async () => {
			const config = await LlmConfigService.getConfigById(configId)
			setFormData(config)
		}

		fetchConfig()
	}, [configId])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			let item: ILlmConfig
			if (configId) {
				await LlmConfigService.updateConfig(configId, formData)
				item = formData
			} else {
				const response = await LlmConfigService.createConfig(formData)
				item = response
			}
			if (onSubmit) onSubmit(item)
		} catch (error) {
			console.error(error)
		}
	}

	const loadModels = async () => {
		if (isLoadingModels) return
		setIsLoadingModels(true)
		setLoadingModelsError(null)
		const response = await ai.actions.fetchModels({ config: formData })
		setIsLoadingModels(false)
		if (response.models) {
			setModels(response.models)
		}
		if (!response.success) {
			setLoadingModelsError(response.message)
		}
	}


	return (
		<div className="max-w-sm mx-auto p-4 bg-base-100 rounded space-y-4 text-left">
			<form onSubmit={handleSubmit}>
				<Input
					label="Name"
					name="name"
					placeholder='Ex: Base, ...'
					type="text"
					value={formData.name}
					onChange={handleChange}
				/>
				<Input
					label="URL"
					name="url"
					type="text"
					placeholder='Ex: http://localhost:11434'
					value={formData.url}
					onChange={handleChange}
				/>

				<div className="flex flex-row items-center gap-2">
					<Select
						label={`Model (${formData.model || "None"})`}
						onChange={(e) => {
							setFormData({ ...formData, model: e.target.value })
						}}
						options={[
							{ label: 'Select model...', value: '' },
							...models.map(m => ({
								label: m.name,
								value: m.name
							}))
						]}
					/>
					<div className="mt-6">
						<Button
							type="button" // Explicitly set type to button
							theme="dark"
							isLoading={isLoadingModels}
							onClick={loadModels}
						>
							<FontAwesomeIcon icon={faRefresh} />
						</Button>
					</div>
				</div>

				{loadingModelsError && <p className='text-red-500'>{loadingModelsError}</p>}

				<label className="block w-full">
					<input
						type="checkbox"
						name="isDefault"
						checked={formData.isDefault}
						onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
					/>
					<span className='ml-2 font-bold'>Default</span>
				</label>

				<Button type="submit" theme="primary">
					Save
				</Button>
			</form>
		</div>
	)
}

export default LlmConfigForm
