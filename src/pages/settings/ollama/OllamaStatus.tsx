import { faRefresh, faSpinner, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Box from "../../../components/Box"
import Button from "../../../components/Button"
import { UseConfigChecker } from "../../../hooks/useConfigChecker"
import { formatDistanceToNow } from "date-fns"


const OllamaStatus: React.FC<{
	configChecker: UseConfigChecker
}> = ({
	configChecker
}) => {

		const formatLastCheck = (date: Date | null) => {
			if (!date) return 'Never'
			return formatDistanceToNow(date, { addSuffix: true })
		}

		return <Box title="Status">
			<div className="flex items-center gap-3 ">
				<div className={`w-3 h-3 rounded-full ${configChecker.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
				<span className='flex-grow'>Ollama Status: {configChecker.isRunning ? 'Online' : 'Offline'}</span>
				<Button theme="ghost"
					isLoading={configChecker.isCheckingRunning}
					onClick={configChecker.actions.checkStatus}>
					<FontAwesomeIcon icon={faRefresh} className={configChecker.isCheckingRunning ? 'animate-spin' : ''} />
				</Button>
			</div>
			{configChecker.isLocalServer && <>
				<div className="flex items-center gap-3 bg-base-200 pl-8 pr-4 rounded">
					<FontAwesomeIcon
						icon={configChecker.isCheckingInstall ? faSpinner : (configChecker.isInstalled ? faCheck : faTimes)}
						className={`text-xl ${configChecker.isCheckingInstall ? 'animate-spin' : (configChecker.isInstalled ? 'text-green-500' : 'text-red-500')}`}
					/>
					<div className="flex-grow">
						<span className="block">Ollama Installed: {configChecker.isInstalled ? 'Yes' : 'No'}</span>
						<span className="text-sm opacity-50 relative -top-2">Last checked: {formatLastCheck(configChecker.lastInstallCheck)}</span>

						{configChecker.isLocalServer && <>
							{!configChecker.isInstalled && <Box title="Installation">
								<p>Looks like you don't have Ollama installed on your computer.</p>
								<p>You can either follow the instructions on this page: <a href="https://ollama.com/download" target="_blank">Download Ollama yourself</a>.</p>
								<p>Or you can use the button below to install Ollama automatically.</p>
							</Box>}
						</>}

					</div>
					<Button theme="ghost"
						isLoading={configChecker.isCheckingInstall}
						onClick={configChecker.actions.checkInstall}>
						<FontAwesomeIcon icon={faRefresh} className={configChecker.isCheckingInstall ? 'animate-spin' : ''} />
					</Button>
				</div>
			</>}
			<div className="flex items-center gap-3 bg-base-200 pl-8 pr-4 rounded">
				<FontAwesomeIcon
					icon={configChecker.isCheckingRunning ? faSpinner : (configChecker.isRunning ? faCheck : faTimes)}
					className={`text-xl ${configChecker.isCheckingRunning ? 'animate-spin' : (configChecker.isRunning ? 'text-green-500' : 'text-red-500')}`}
				/>
				<div className="flex-grow">
					<span className="block">Ollama Server Running: {configChecker.isRunning ? 'Yes' : 'No'}</span>
					<span className="text-sm opacity-50 relative -top-2">Last checked: {formatLastCheck(configChecker.lastRunningCheck)}</span>
				</div>
				<Button theme="ghost"
					isLoading={configChecker.isCheckingRunning}
					onClick={configChecker.actions.checkStatusWithPing}>
					<FontAwesomeIcon icon={faRefresh} className={configChecker.isCheckingRunning ? 'animate-spin' : ''} />
				</Button>
			</div>
			<div className='flex flex-row gap-2 items-center pt-4'>
				<Button
					onClick={configChecker.actions.toggleServer}
					theme="primary"
					isOutline
					disabled={configChecker.isTogglingServer || !configChecker.isLocalServer}>
					{configChecker.isTogglingServer ? (
						<>
							<FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
							{configChecker.isRunning ? 'Stopping Server...' : 'Starting Server...'}
						</>
					) : (
						configChecker.isRunning ? 'Stop Server' : 'Start Server'
					)}
				</Button>
				{!configChecker.isLocalServer && <p className='text-red-500'>This is not a local server, we cannot start and stop it.</p>}
			</div>
		</Box>
	}

export default OllamaStatus
