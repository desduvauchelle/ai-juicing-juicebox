import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Select from '../../components/Select'
import Box from '../../components/Box'
import OllamaSystemInformation from './ollama/OllamaSystemInformation'
import { useConfigChecker } from '../../hooks/useConfigChecker'
import LlmConfigService from '../../services/LlmConfigService'
import OllamaStatus from './ollama/OllamaStatus'
import OllamaInstalledModels from './ollama/OllamaInstalledModels'
import { ILlmConfig } from '../../../types/ILlmConfig'


const OllamaPage: React.FC = () => {
	const [configs, setConfigs] = useState<Array<ILlmConfig>>([])
	const [selectedConfig, setSelectedConfig] = useState<number | null>(null)

	const isFetching = useRef<boolean>(false)
	const currentModelRef = React.useRef<number | null>(null)


	const currentConfig = useMemo(() => {
		return configs.find(c => c.id === selectedConfig)
	}, [configs, selectedConfig])

	const configChecker = useConfigChecker({ config: currentConfig })

	const {
		isRunning,
	} = configChecker

	useEffect(() => {
		if (!currentConfig) return
		if (currentModelRef.current === currentConfig.id) return
		if (configChecker.isCheckingInstall || configChecker.isCheckingRunning) return
		currentModelRef.current = currentConfig.id
		configChecker.actions.checkStatus()
	}, [configChecker.actions, currentConfig, configChecker.isCheckingInstall, configChecker.isCheckingRunning])

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true

		const allConfigs = await LlmConfigService.getAllConfigs()
		setConfigs(allConfigs)
		if (allConfigs.length > 0) {
			if (!selectedConfig) {
				setSelectedConfig(allConfigs[0].id)
			}
		}
		isFetching.current = false
	}, [selectedConfig])

	useEffect(() => {
		fetchConfigs()
	}, [fetchConfigs])




	return <div className="space-y-8">
		<Box title="Test configuration">
			<Select
				label='Select LLM Configuration'
				value={selectedConfig?.toString() || ''}
				onChange={(e) => setSelectedConfig(parseInt(e.target.value))}
				options={[
					{
						value: "",
						label: 'Select LLM Configuration',
						disabled: true
					},
					...configs.map(c => {
						return {
							value: c.id.toString(),
							label: c.name
						}
					})
				]} />
		</Box>

		{selectedConfig && <>

			<OllamaStatus configChecker={configChecker} />



			{isRunning && <>
				<OllamaInstalledModels
					configChecker={configChecker}
					selectedConfig={selectedConfig}
					configs={configs} />

			</>}
		</>}

		<OllamaSystemInformation />
	</div>
}

export default OllamaPage
