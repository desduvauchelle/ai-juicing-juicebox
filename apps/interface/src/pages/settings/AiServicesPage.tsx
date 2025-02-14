import React, { useState } from 'react'
import Button from '../../components/Button'
import { IAIService, services } from '../../../types/IAIService'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AlertModal, showModal, hideModal } from '../../components/AlertModal'
import AiServiceForm from '../../ai-service/AiServiceForm'
import { useMainContext } from '../../context/MainContext'

const NEW_CONFIG_MODAL_ID = 'new-config-modal'
const EDIT_CONFIG_MODAL_ID = 'edit-config-modal'

const AiServicesPage: React.FC = () => {
	const { aiServices: configs, actions } = useMainContext()
	const [editingConfig, setEditingConfig] = useState<IAIService & { id: number } | null>(null)



	const handleDelete = async (id: number) => {
		await actions.aiServices.delete({ configId: id })
	}



	// Group configs by service and filter out services with no configs
	const groupedConfigs = [...services]
		.sort()
		.reduce((acc, service) => {
			const serviceConfigs = configs.filter(config => config.service === service)
			if (serviceConfigs.length > 0) {
				acc[service] = serviceConfigs
			}
			return acc
		}, {} as Record<string, typeof configs>)

	return <div className="w-full max-w-2xl mx-auto px-4 space-y-8">
		<div className="flex flex-row gap-2 items-center pt-8">
			<h1 className="text-2xl font-bold flex-grow">Your AI services</h1>
			<Button onClick={() => showModal(NEW_CONFIG_MODAL_ID)} theme="primary" className='flex-shrink-0'>Add service</Button>
		</div>
		<p className="italic">Adding services allows you to connect to different AI models. We recommend Ollama for the most privacy.</p>

		<div className="space-y-8">
			{Object.entries(groupedConfigs).map(([service, serviceConfigs]) => (
				<div key={service} className="space-y-4">
					<h2 className="text-xl font-semibold border-b border-base-300 pb-2">{service}</h2>
					<ul className="space-y-4">
						{serviceConfigs.map(config => (
							<li key={config.id} className="bg-base-200 p-4 rounded-xl flex flex-col gap-4">
								<p className='text-xl font-black'>{config.name}</p>
								<div className="flex flex-row gap-2 items-center">
									<Button onClick={() => {
										setEditingConfig(config)
										showModal(EDIT_CONFIG_MODAL_ID)
									}} theme="secondary" isOutline isSmall>Edit</Button>
									<Button onClick={() => handleDelete(config.id)}
										theme="danger" isOutline
										isSmall>
										<FontAwesomeIcon icon={faTrash} />
									</Button>
									<div className="flex-grow"></div>



								</div>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>

		<AlertModal id={NEW_CONFIG_MODAL_ID} title="Create New Config">
			<AiServiceForm
				afterSubmit={() => {
					hideModal(NEW_CONFIG_MODAL_ID)
				}}
			/>
		</AlertModal>

		<AlertModal id={EDIT_CONFIG_MODAL_ID} title="Edit Config">
			{editingConfig && (
				<AiServiceForm
					initialValues={editingConfig}
					configId={editingConfig.id}
					afterSubmit={() => {
						setEditingConfig(null)
						hideModal(EDIT_CONFIG_MODAL_ID)
					}}
				/>
			)}
		</AlertModal>

	</div>
}

export default AiServicesPage
