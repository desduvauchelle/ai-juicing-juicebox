import { useState, useCallback } from 'react'
import { bridgeApi } from '../tools/bridgeApi'
import { IAIService } from '../../types/IAIService'

const localServers = ["localhost", "0.0.0.0", "127.0.0.1"]

interface UseConfigCheckerProps {
	config?: IAIService
}

export const useConfigChecker = ({ config }: UseConfigCheckerProps = {}) => {
	const [isInstalled, setIsInstalled] = useState(false)
	const [isRunning, setIsRunning] = useState(false)
	const [errors, setErrors] = useState<string[]>([])
	const [lastInstallCheck, setLastInstallCheck] = useState<Date | null>(null)
	const [lastRunningCheck, setLastRunningCheck] = useState<Date | null>(null)
	const [isCheckingInstall, setIsCheckingInstall] = useState(false)
	const [isCheckingRunning, setIsCheckingRunning] = useState(false)
	const [isTogglingServer, setIsTogglingServer] = useState(false)

	const checkInstall = useCallback(async () => {
		setIsCheckingInstall(true)
		try {
			const installed = await bridgeApi.ollamaInstallCheck()
			setIsInstalled(installed)
			setLastInstallCheck(new Date())
		} finally {
			setIsCheckingInstall(false)
		}
	}, [])

	const checkStatusWithPing = useCallback(async () => {
		if (!config) {
			setErrors(['No config provided'])
			return
		}
		if (!config.url) {
			setErrors(['Config does not have a URL'])
			return
		}

		setIsCheckingRunning(true)
		try {
			const url = config.url?.replace("/api", "")
			const response = await fetch(url)
			setIsRunning(response.ok)
			setLastRunningCheck(new Date())
		} catch {
			setIsRunning(false)
		} finally {
			setIsCheckingRunning(false)
			setLastRunningCheck(new Date())
		}
	}, [config])

	const checkStatus = useCallback(async () => {
		await checkInstall()
		await checkStatusWithPing()
	}, [checkInstall, checkStatusWithPing])

	const isLocalServer = useCallback(() => {
		if (!config?.url) return false
		try {
			const url = new URL(config.url)
			return localServers.includes(url.hostname)
		} catch {
			return false
		}
	}, [config])

	const toggleServer = async () => {
		if (!isLocalServer()) {
			setErrors(['This is not a local server, we cannot start and stop it.'])
			return
		}
		setIsTogglingServer(true)
		try {
			const result = await bridgeApi.ollamaServerToggle(!isRunning)
			if (result) {
				await checkStatus()
			}
		} finally {
			setIsTogglingServer(false)
		}
	}



	return {
		// States
		isInstalled,
		isRunning,
		errors,
		lastInstallCheck,
		lastRunningCheck,
		isCheckingInstall,
		isCheckingRunning,
		isTogglingServer,
		isLocalServer: isLocalServer(),
		// Actions
		actions: {
			checkInstall,
			checkStatusWithPing,
			checkStatus,
			toggleServer
		}
	}
}

export type UseConfigChecker = ReturnType<typeof useConfigChecker>
