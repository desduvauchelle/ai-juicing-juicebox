import React, { useLayoutEffect } from 'react'
import { useMainContext } from '../context/MainContext'
import { IAIService, IModel } from '../../types/IAIService'
import modelsList from '../data/modelList'
import Button, { MyLink } from '../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faCog } from '@fortawesome/free-solid-svg-icons'
import AiModelTypes from './AiModelTypes'

interface ModalPickAiServiceProps {
	isOpen: boolean
	onSelect: (service: IAIService, modelName?: string) => void
	onCancel: () => void
}

const filterOptions = [
	{ value: 'text' as const, label: 'Text' },
	{ value: 'structured' as const, label: 'Structured Output' },
	{ value: 'tools' as const, label: 'Tool Calling' },
	{ value: 'embedding' as const, label: 'Embedding' }
] as const

type ModelFilter = typeof filterOptions[number]['value']

const isModelMatchingFilter = (model: IModel, filter: ModelFilter): boolean => {
	switch (filter) {
		case 'text':
			return !model.features?.forEmbedding && !model.features?.forImage
		case 'structured':
			return !!model.features?.hasJson
		case 'tools':
			return !!model.features?.hasToolUse
		case 'embedding':
			return !!model.features?.forEmbedding
		default:
			return true
	}
}

const getModelsForService = (serviceName: string): IModel[] => {
	return modelsList.filter(model => model.service === serviceName)
}

const ServiceDisplay: React.FC<{
	serviceName: string,
	configs: IAIService[],
	onSelect: (service: IAIService, modelName?: string) => void,
	activeFilter: ModelFilter
}> = ({ serviceName, configs, onSelect, activeFilter }) => {
	const mainContext = useMainContext()
	// const [selectedConfigId, setSelectedConfigId] = React.useState<number | null>(null)

	const handleMakeDefault = (config: IAIService, modelName: string) => {
		mainContext.actions.userSettings.update({
			defaultAiService: {
				configId: config.id,
				modelName
			}
		})
		onSelect(config, modelName)
	}

	return <div className='py-2'>
		<div className="flex flex-row items-center gap-2">
			<span className='uppercase opacity-50 font-medium tracking-wider text-sm flex-grow'>{serviceName}</span>

		</div>
		<div className="border-l border-base-300 pl-2 py-1">
			{configs.map(config => {
				const models = [
					...(config.models || []),
					...getModelsForService(config.service)
				].filter(model => isModelMatchingFilter(model, activeFilter))

				if (models.length === 0) return null

				return <div key={config.id}>
					{configs.length > 1 && <h3 className="uppercase opacity-50 font-medium tracking-wider text-sm">{config.name}</h3>}
					<ul className="list-none" key={config.id}>
						{models.map(model => {
							const isDefault = mainContext.userSettings?.defaultAiService?.configId === config.id && mainContext.userSettings.defaultAiService?.modelName === model.name
							return <li key={model.name} className='py-1 px-2 flex flex-row items-center gap-3 hover:bg-base-300 transition-all duration-300 ease-in-out rounded-full group'>
								<Button
									role="button"
									tooltip='Make default'
									className={isDefault ? 'text-primary' : 'text-base-200 group-hover:text-base-100'}
									onClick={() => handleMakeDefault(config, model.name)}
									theme="custom">
									<FontAwesomeIcon icon={faCircle} />
								</Button>

								<Button
									theme="custom"
									role='button'
									className='flex-grow text-left'
									onClick={() => {
										onSelect(config, model.name)
										const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
										modal?.close()
									}}>
									{model.displayName || model.name}

								</Button>

								<AiModelTypes
									model={model}
									modelList={modelsList} />
							</li>
						})}

					</ul>

				</div>
			})}
		</div>
	</div>
}


export const ModalPickAiService: React.FC<ModalPickAiServiceProps> = ({ isOpen, onSelect, onCancel }) => {
	const context = useMainContext()
	const [activeFilter, setActiveFilter] = React.useState<ModelFilter>('text')

	// show dialog when isOpen becomes true
	useLayoutEffect(() => {
		if (isOpen) {
			const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
			modal?.showModal()
		}
	}, [isOpen])

	if (!isOpen) return null

	const aiServices = context.aiServices
	const groupedServices = aiServices.length > 0
		? aiServices.reduce((acc, service) => {
			if (!acc[service.service]) {
				acc[service.service] = []
			}
			acc[service.service].push(service)
			return acc
		}, {} as Record<string, IAIService[]>)
		: {}



	return <dialog id="modal-pick-ai" className="modal ">
		<div className="modal-box">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-2xl" onClick={() => {
					const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
					modal?.close()
					onCancel()
				}}>✕</button>
			</form>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-2 items-center">
					<h3 className="font-bold text-lg">
						Select an AI Service
					</h3>
					<MyLink isButton isSmall theme="ghost" href="/settings/ai-services">
						<FontAwesomeIcon icon={faCog} />
					</MyLink>
				</div>


				<div className="join mx-auto">
					{filterOptions.map(option => (
						<input
							key={option.value}
							className={`join-item btn ${activeFilter === option.value ? 'btn-secondary' : ''} btn-sm`}
							type="radio"
							name="filter-options"
							checked={activeFilter === option.value}
							onChange={() => setActiveFilter(option.value)}
							aria-label={option.label} />
					))}
				</div>

				{Object.entries(groupedServices).map(([serviceName, configs], i) => {
					return <ServiceDisplay
						key={i}
						serviceName={serviceName}
						configs={configs}
						onSelect={onSelect}
						activeFilter={activeFilter}
					/>
				})}
			</div>
		</div>
		<form method="dialog" className="modal-backdrop">
			<button onClick={() => {
				const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
				modal?.close()
				onCancel()
			}}>close</button>
		</form>
	</dialog>

}
