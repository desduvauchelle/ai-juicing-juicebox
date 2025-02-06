import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../../components/Button'
import LlmConfigForm from '../../llm-config/LlmConfigForm'
import LlmConfigurationService from '../../services/llmConfigurationService'
import { ILlmConfig } from '../../../types/ILlmConfig'

const LlmConfigs: React.FC = () => {
	const [configs, setConfigs] = useState<Array<ILlmConfig & { id: number }>>([])
	// const [searchQuery] = useState<string>('')
	const [editingConfig, setEditingConfig] = useState<ILlmConfig & { id: number } | null>(null)
	const [isCreating, setIsCreating] = useState<boolean>(false)
	const isFetching = useRef<boolean>(false)

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true

		const allConfigs = await LlmConfigurationService.getAllConfigs()
		setConfigs(allConfigs)
		isFetching.current = false
	}, [])

	useEffect(() => {
		fetchConfigs()
	}, [fetchConfigs])

	// const handleSearch = async (e?: FormEvent) => {
	// 	if (e) e.preventDefault()
	// 	const results = await LlmConfigurationService.searchConfigs(searchQuery)
	// 	setConfigs(results)
	// }

	const handleFormSubmit = async (config: ILlmConfig) => {
		console.log(config)
		setEditingConfig(null)
		setIsCreating(false)
		fetchConfigs()
	}

	const handleDelete = async (id: number) => {
		await LlmConfigurationService.deleteConfig(id)
		fetchConfigs()
	}

	return <div className="w-full max-w-2xl mx-auto px-4 space-y-8">

		<div className="flex flex-row gap-2 items-center pt-8">

			<h1 className="text-2xl font-bold flex-grow">LLM Configurations</h1>
			<Button onClick={() => setIsCreating(true)} theme="primary" className='flex-shrink-0'>Create New Config</Button>

		</div>

		<div className="">
			{isCreating && (
				<div className="mt-4">
					<h2 className="text-xl font-bold text-center">New Config</h2>
					<LlmConfigForm onSubmit={handleFormSubmit} />
				</div>
			)}
		</div>
		{editingConfig && (
			<div className="">
				<h2 className="text-xl font-bold text-center">Edit Config</h2>
				<LlmConfigForm initialValues={editingConfig} configId={editingConfig.id} onSubmit={handleFormSubmit} />
			</div>
		)}
		<ul className="space-y-4">
			{configs.map(config => (
				<li key={config.id} className="bg-base-200 p-4 rounded-xl flex flex-col gap-4">
					<p className='text-xl font-black'>{config.name}</p>
					<div className="flex flex-row gap-2 items-center">
						<Button onClick={() => setEditingConfig(config)} theme="primary" isOutline>Edit</Button>
						<Button onClick={() => handleDelete(config.id)} theme="danger" isOutline>Delete</Button>
					</div>
				</li>
			))}
		</ul>

	</div>
}

export default LlmConfigs
