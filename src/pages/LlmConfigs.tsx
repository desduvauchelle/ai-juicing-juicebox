import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import LlmConfigurationService from '../services/llmConfigurationService'
import { ILlmConfig } from '../../types/ILlmConfig'
import LlmConfigForm from '../llm-config/LlmConfigForm'
import Button, { MyLink } from '../components/Button'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Input from '../components/Input'

const LlmConfigs: React.FC = () => {
	const [configs, setConfigs] = useState<Array<ILlmConfig & { id: IDBValidKey }>>([])
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [editingConfig, setEditingConfig] = useState<ILlmConfig & { id: IDBValidKey } | null>(null)
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

	const handleSearch = async (e?: FormEvent) => {
		if (e) e.preventDefault()
		const results = await LlmConfigurationService.searchConfigs(searchQuery)
		setConfigs(results)
	}

	const handleFormSubmit = async (config: ILlmConfig) => {
		console.log(config)
		setEditingConfig(null)
		setIsCreating(false)
		fetchConfigs()
	}

	const handleDelete = async (id: IDBValidKey) => {
		await LlmConfigurationService.deleteConfig(id)
		fetchConfigs()
	}

	return <div className="w-full max-w-2xl mx-auto px-4 space-y-8">

		<div className="flex flex-row gap-2 items-center pt-8">
			<MyLink href="/chats" aria-label="Back" isButton theme="ghost">
				<FontAwesomeIcon icon={faArrowLeft} />
			</MyLink>
			<h1 className="text-2xl font-bold">LLM Configurations</h1>
		</div>
		<form className="flex flex-row gap-2 w-full" onSubmit={handleSearch}>
			<Input
				aria-label="Search LLM configs"
				type="text"
				placeholder="Search..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="w-full flex-grow"
			/>
			<Button onClick={handleSearch} theme="primary">Search</Button>
			<Button onClick={() => setIsCreating(true)} theme="success" className='flex-shrink-0'>Create New Config</Button>

		</form>

		<div className="">
			{isCreating && (
				<div className="mt-4">
					<h2 className="text-xl font-bold">Create New Config</h2>
					<LlmConfigForm onSubmit={handleFormSubmit} />
				</div>
			)}
		</div>
		{editingConfig && (
			<div className="">
				<h2 className="text-xl font-bold">Edit Config</h2>
				<LlmConfigForm initialValues={editingConfig} configId={editingConfig.id} onSubmit={handleFormSubmit} />
			</div>
		)}
		<ul>
			{configs.map(config => (
				<li key={config.id} className="border p-2 mb-2">
					<div>{config.name}</div>
					<Button onClick={() => setEditingConfig(config)} theme="warning">Edit</Button>
					<Button onClick={() => handleDelete(config.id)} theme="danger">Delete</Button>
				</li>
			))}
		</ul>

	</div>
}

export default LlmConfigs
