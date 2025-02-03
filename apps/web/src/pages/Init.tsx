import { useState, useEffect, useCallback, useRef } from "react"
import { ILlmConfig } from "../../types/ILlmConfig"
import LlmConfigurationService from "../services/llmConfigurationService"
import { useNavigate } from "react-router-dom"

const Init: React.FC = () => {
	const navigate = useNavigate()
	const isFetching = useRef<boolean>(false)
	const [configs, setConfigs] = useState<Array<ILlmConfig & { id: number }> | null>(null)

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true
		const allConfigs = await LlmConfigurationService.getAllConfigs()
		console.log(allConfigs)
		setConfigs(allConfigs)
	}, [])

	useEffect(() => {
		fetchConfigs()
	}, [fetchConfigs])

	useEffect(() => {
		if (!configs) return

		if (configs && configs.length > 0) {
			navigate('chat')
			return
		}
		navigate('welcome')
	}, [configs, isFetching, navigate])

	return <></>
}

export default Init
