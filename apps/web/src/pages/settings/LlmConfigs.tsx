import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../../components/Button'
import LlmConfigForm from '../../llm-config/LlmConfigForm'
import LlmConfigService from '../../services/LlmConfigService'
import { ILlmConfig } from '../../../types/ILlmConfig'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AlertModal, showModal, hideModal } from '../../components/AlertModal'
import Radio from '../../components/Radio'

const NEW_CONFIG_MODAL_ID = 'new-config-modal'
const EDIT_CONFIG_MODAL_ID = 'edit-config-modal'

const LlmConfigs: React.FC = () => {
	const [configs, setConfigs] = useState<Array<ILlmConfig & { id: number }>>([])
	const [editingConfig, setEditingConfig] = useState<ILlmConfig & { id: number } | null>(null)
	const [isCreating, setIsCreating] = useState<boolean>(false)
	const isFetching = useRef<boolean>(false)

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true

		const allConfigs = await LlmConfigService.getAllConfigs()
		setConfigs(allConfigs)
		isFetching.current = false
	}, [])

	useEffect(() => {
		fetchConfigs()
	}, [fetchConfigs])

	const handleFormSubmit = async (config: ILlmConfig) => {
		console.log(config)
		setEditingConfig(null)
		setIsCreating(false)
		await fetchConfigs()
		// Close the appropriate modal based on whether we're editing or creating
		hideModal(editingConfig ? EDIT_CONFIG_MODAL_ID : NEW_CONFIG_MODAL_ID)
	}

	const handleDelete = async (id: number) => {
		await LlmConfigService.deleteConfig(id)
		fetchConfigs()
	}

	const handleDefaultChange = async (configId: number) => {
		try {
			await LlmConfigService.setDefaultConfig(configId)
			await fetchConfigs()
		} catch (error) {
			console.error('Error setting default config:', error)
		}
	}

	return <div className="w-full max-w-2xl mx-auto px-4 space-y-8">

		<div className="flex flex-row gap-2 items-center pt-8">

			<h1 className="text-2xl font-bold flex-grow">LLM Configurations</h1>
			<Button onClick={() => showModal(NEW_CONFIG_MODAL_ID)} theme="primary" className='flex-shrink-0'>Create New Config</Button>

		</div>

		<ul className="space-y-4">
			{configs.map(config => (
				<li key={config.id} className="bg-base-200 p-4 rounded-xl flex flex-col gap-4">
					<p className='text-xl font-black'>{config.name}</p>
					<div className="flex flex-row gap-2 items-center">
						<Button onClick={() => {
							setEditingConfig(config)
							showModal(EDIT_CONFIG_MODAL_ID)
						}} theme="secondary" isOutline>Edit</Button>
						<Button onClick={() => handleDelete(config.id)} theme="danger" isOutline>
							<FontAwesomeIcon icon={faTrash} />
						</Button>
						<div className="flex-grow"></div>
						<Radio
							name="default-config"
							label="Default"
							theme={config.isDefault ? 'primary' : 'custom'}
							isSmall
							setTextToLeft
							checked={!!config.isDefault}
							onChange={(e) => {
								if (e.target.checked) {
									handleDefaultChange(config.id)
								}
							}}
							value={config.id.toString()}
						/>
					</div>
				</li>
			))}
		</ul>

		<AlertModal id={NEW_CONFIG_MODAL_ID} title="Create New Config">
			<LlmConfigForm onSubmit={handleFormSubmit} />
		</AlertModal>

		<AlertModal id={EDIT_CONFIG_MODAL_ID} title="Edit Config">
			{editingConfig && (
				<LlmConfigForm
					initialValues={editingConfig}
					configId={editingConfig.id}
					onSubmit={handleFormSubmit}
				/>
			)}
		</AlertModal>

	</div>
}

export default LlmConfigs
