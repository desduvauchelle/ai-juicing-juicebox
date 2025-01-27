import React, { useState, useEffect } from 'react'
import { ILlmConfig } from '../../types/ILlmConfig'
import Input from '../components/Input'
import Button from '../components/Button'
import LlmConfigurationService from '../services/llmConfigurationService'

interface LlmConfigFormProps {
	initialValues?: ILlmConfig
	onSubmit?: (cfg: ILlmConfig) => void
	configId?: IDBValidKey
}

const LlmConfigForm: React.FC<LlmConfigFormProps> = ({ initialValues, configId, onSubmit }) => {
	const [formData, setFormData] = useState<ILlmConfig>(initialValues || {
		id: 1,
		name: '',
		service: 'ollama',
		url: '',
		model: ''
	})

	useEffect(() => {
		if (!configId) return

		const fetchConfig = async () => {
			const config = await LlmConfigurationService.getConfigById(configId)
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
				await LlmConfigurationService.updateConfig(configId, formData)
				item = formData
			} else {
				const response = await LlmConfigurationService.createConfig(formData)
				item = response
			}
			if (onSubmit) onSubmit(item)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 bg-white rounded shadow space-y-4 text-left">
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
				onChange={handleChange} />
			<Input
				label="Model"
				name="model"
				type="text"
				value={formData.model}
				onChange={handleChange} />

			<Button type="submit" theme="primary">
				Save
			</Button>
		</form>
	)
}

export default LlmConfigForm
