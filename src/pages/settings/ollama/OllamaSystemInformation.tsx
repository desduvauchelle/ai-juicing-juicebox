import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useCallback, useEffect } from "react"
import { SystemInfo } from "../../../../types/Electron"
import Box from "../../../components/Box"
import { bridgeApi } from "../../../tools/bridgeApi"


const OllamaSystemInformation: React.FC = () => {
	const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
	const [isLoadingSystemInfo, setIsLoadingSystemInfo] = useState(false)

	const fetchSystemInfo = useCallback(async () => {
		setIsLoadingSystemInfo(true)
		try {
			const info = await bridgeApi.systemInfoGet()
			setSystemInfo(info)
		} finally {
			setIsLoadingSystemInfo(false)
		}
	}, [])

	useEffect(() => {
		fetchSystemInfo()
	}, [fetchSystemInfo])

	return <Box title="System Information">
		{isLoadingSystemInfo ? (
			<div className="flex items-center gap-2">
				<FontAwesomeIcon icon={faSpinner} className="animate-spin" />
				<span>Loading system information...</span>
			</div>
		) : systemInfo ? (
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 className="font-bold mb-2">Operating System</h3>
					<div className="space-y-1 text-sm">
						<p>Platform: {systemInfo.os.platform}</p>
						<p>Distribution: {systemInfo.os.distro}</p>
						<p>Release: {systemInfo.os.release}</p>
						<p>Architecture: {systemInfo.os.arch}</p>
					</div>
				</div>
				<div>
					<h3 className="font-bold mb-2">CPU</h3>
					<div className="space-y-1 text-sm">
						<p>Model: {systemInfo.cpu.brand}</p>
						<p>Manufacturer: {systemInfo.cpu.manufacturer}</p>
						<p>Cores: {systemInfo.cpu.cores}</p>
					</div>
				</div>
				<div>
					<h3 className="font-bold mb-2">Memory</h3>
					<div className="space-y-1 text-sm">
						<p>Total: {(systemInfo.memory.total / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
						<p>Free: {(systemInfo.memory.free / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
						<p>Used: {((systemInfo.memory.total - systemInfo.memory.free) / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
					</div>
				</div>
				<div>
					<h3 className="font-bold mb-2">Storage</h3>
					<div className="space-y-1 text-sm">
						<p>Total: {(systemInfo.disk.total / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
						<p>Free: {(systemInfo.disk.free / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
						<p>Used: {((systemInfo.disk.total - systemInfo.disk.free) / (1024 * 1024 * 1024)).toFixed(2)} GB</p>
					</div>
				</div>
				{systemInfo.graphics.controllers.length > 0 && (
					<div className="md:col-span-2">
						<h3 className="font-bold mb-2">Graphics</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{systemInfo.graphics.controllers.map((gpu, index) => (
								<div key={index} className="space-y-1 text-sm">
									<p>Model: {gpu.model}</p>
									{gpu.vram > 0 && <p>VRAM: {(gpu.vram / 1024).toFixed(2)} GB</p>}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		) : (
			<div className="text-gray-500">Unable to load system information</div>
		)}
	</Box>
}

export default OllamaSystemInformation
