import { faSpinner, faTrash, faRefresh } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useState } from "react"
import Box from "../../../components/Box"
import Button from "../../../components/Button"
import { UseConfigChecker } from "../../../hooks/useConfigChecker"
import { bridgeApi } from "../../../tools/bridgeApi"
import React from "react"
import { ILlmConfig, OllamaModel } from "../../../../types/ILlmConfig"
import useAi from "../../../hooks/useAi"
import { OllamaRemoteModel } from "../../../../types/Electron"


const OllamaInstalledModels: React.FC<{
	configChecker: UseConfigChecker,
	selectedConfig: number | null,
	configs: Array<ILlmConfig>
}> = ({
	configChecker,
	selectedConfig,
	configs
}) => {
		const [models, setModels] = useState<OllamaModel[]>([])
		const [isLoadingModels, setIsLoadingModels] = useState(false)
		const { actions } = useAi()
		const modelsBeingLoadedRef = React.useRef(false)
		const [showDownloadNewModels, setShowDownloadNewModels] = useState(false)
		const [availableModels, setAvailableModels] = useState<OllamaRemoteModel[]>([])
		const [isLoadingRemoteModels, setIsLoadingRemoteModels] = useState(false)

		const fetchModels = useCallback(async () => {
			if (modelsBeingLoadedRef.current) return
			if (!selectedConfig || !configChecker.isRunning) return // Add isRunning check here
			if (isLoadingModels) return
			const config = configs.find(c => c.id === selectedConfig)
			if (!config) return

			modelsBeingLoadedRef.current = true
			setIsLoadingModels(true)
			try {
				const result = await actions.fetchModels({ config })
				modelsBeingLoadedRef.current = false
				if (result.success) {
					setModels(result.models)
				}
			} finally {
				setIsLoadingModels(false)
			}
		}, [selectedConfig, configChecker.isRunning, isLoadingModels, configs, actions]) // Add isRunning to dependencies

		useEffect(() => {
			if (!selectedConfig || !configChecker.isRunning) return // Add isRunning check here
			if (isLoadingModels) return
			if (models.length > 0) return
			fetchModels()
		}, [fetchModels, isLoadingModels, configChecker.isRunning, models.length, selectedConfig]) // Only depend on isRunning and selectedConfig, not fetchModels




		const removeModel = async (modelName: string) => {
			if (!confirm(`Are you sure you want to remove ${modelName}?`)) {
				return
			}

			try {
				await bridgeApi.ollamaModelRemove(modelName)
				// Refresh the models list
				fetchModels()
			} catch (error) {
				console.error('Error removing model:', error)
			}
		}

		const fetchRemoteModels = useCallback(async () => {
			if (isLoadingRemoteModels) return
			setIsLoadingRemoteModels(true)
			try {
				const response = await bridgeApi.ollamaModelRemote()
				setAvailableModels(response)
				setIsLoadingRemoteModels(false)
			} catch (error) {
				setIsLoadingRemoteModels(false)
				console.error(error)
			}
		}, [isLoadingRemoteModels])


		return <Box title="Models">
			{isLoadingModels && <>
				<div className="flex items-center gap-2">
					<FontAwesomeIcon icon={faSpinner} className="animate-spin" />
					<span>Loading models...</span>
				</div>
			</>}
			{!isLoadingModels && <>
				{models.length === 0 && <>
					<div className="opacity-70 italic">No models found</div>
				</>}
				{models.length > 0 && <>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{models.map((model) => (
							<div key={model.name} className="bg-base-300 p-4 rounded">
								<div className="flex justify-between items-start">
									<div>
										<div className="font-bold">{model.name}</div>
										<div className="text-sm opacity-50">
											Size: {(model.size / (1024 * 1024 * 1024)).toFixed(1)}GB
										</div>
									</div>
									<Button
										theme="danger"
										isSmall
										onClick={() => removeModel(model.name)}
									>
										<FontAwesomeIcon icon={faTrash} />
									</Button>
								</div>
							</div>
						))}
					</div>
				</>}
			</>}

			<div className="flex flex-row gap-2 items-center">
				<Button
					theme="primary"
					isOutline
					onClick={fetchModels}
					isLoading={isLoadingModels}>
					<FontAwesomeIcon icon={faRefresh} className='mr-2' />
					Refresh Models
				</Button>
				<Button
					theme="primary"
					isOutline
					disabled={true}
					onClick={() => {
						setShowDownloadNewModels(!showDownloadNewModels)
						fetchRemoteModels()
					}}>
					Download New Models (Coming soon)
				</Button>
			</div>

			{showDownloadNewModels && <>
				{isLoadingRemoteModels && <>
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faSpinner} className="animate-spin" />
						<span>Loading remote models...</span>
					</div>
				</>}
				{!isLoadingRemoteModels && <>
					{availableModels.length === 0 && <>
						<div className="opacity-70 italic">No models found</div>
					</>}
					{availableModels.length > 0 && <>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{availableModels.map((model) => (
								<div key={model.name} className="bg-base-300 p-4 rounded">
									<div className="flex justify-between items-start">
										<div>
											<div className="font-bold">{model.name}</div>
											<div className="text-sm opacity-50">
												{/* Size: {(model.size / (1024 * 1024 * 1024)).toFixed(1)}GB */}
											</div>
										</div>
										<Button
											theme="primary"
											isSmall
											onClick={() => {
												// bridgeApi.ollamaModelDownload(model.url)
											}}
										>
											Download
										</Button>
									</div>
								</div>
							))}
						</div>
					</>}
				</>}
			</>}


		</Box>
	}

export default OllamaInstalledModels
