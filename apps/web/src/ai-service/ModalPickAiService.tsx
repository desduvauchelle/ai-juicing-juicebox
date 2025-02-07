import React, { useLayoutEffect } from 'react'
import { useMainContext } from '../context/MainContext'
import { IAIService } from '../../types/IAIService'

interface ModalPickAiServiceProps {
	isOpen: boolean
	onSelect: (service: IAIService, modelName?: string) => void
	onCancel: () => void
}

export const ModalPickAiService: React.FC<ModalPickAiServiceProps> = ({ isOpen, onSelect, onCancel }) => {
	const context = useMainContext()

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
		: null

	return (
		<dialog id="modal-pick-ai" className="modal ">
			<div className="modal-box">
				<form method="dialog">
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => {
						const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
						modal?.close()
						onCancel()
					}}>✕</button>
				</form>
				{groupedServices ? (
					<>
						<h3 className="font-bold text-lg mb-4">Select an AI Service</h3>
						<ul className="menu">
							{Object.entries(groupedServices).map(([serviceName, configs]) => (
								<li key={serviceName}>
									<h2 className="menu-title uppercase">{serviceName}</h2>
									<ul>
										{configs.map(config => (
											<li key={config.id}>
												{config.service === 'Ollama' ? (
													<>
														<h3 className="menu-title">{config.name}</h3>
														{config.models && config.models.length > 0 && (
															<ul>
																{config.models.map(model => (
																	<li key={model.name}>
																		<a onClick={() => {
																			onSelect(config, model.name)
																			const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
																			modal?.close()
																		}}>
																			{model.name}
																			{model.isDefault && (
																				<span className="badge badge-sm badge-primary ml-2">Default</span>
																			)}
																		</a>
																	</li>
																))}
															</ul>
														)}
													</>
												) : (
													<a onClick={() => {
														onSelect(config)
														const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
														modal?.close()
													}}>
														{config.name}
														{config.isDefault && (
															<span className="badge badge-sm badge-primary ml-2">Default</span>
														)}
													</a>
												)}
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					</>
				) : (
					<>
						<h3 className="font-bold text-lg mb-4">No AI Services Configured</h3>
						<button className="btn btn-primary" onClick={() => {
							const modal = document.getElementById("modal-pick-ai") as HTMLDialogElement
							modal?.close()
							onCancel()
						}}>
							Close
						</button>
					</>
				)}
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	)
}
