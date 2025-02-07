import { useState, useEffect, useCallback, useRef } from "react"
import LlmConfigService from "../services/AiServiceService"
import { useNavigate } from "react-router-dom"
import { IAIService } from "../../types/IAIService"

const Init: React.FC = () => {
	const navigate = useNavigate()
	const isFetching = useRef<boolean>(false)
	const [configs, setConfigs] = useState<Array<IAIService & { id: number }> | null>(null)

	const fetchConfigs = useCallback(async () => {
		if (isFetching.current) return
		isFetching.current = true
		const allConfigs = await LlmConfigService.getAllConfigs()
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
