import { ipcMain } from "electron"
import si from 'systeminformation'

export const registerIpcSystemInfo = () => {

	// Add this before the other IPC handlers
	ipcMain.handle('system-info-get', async () => {
		try {
			const [osInfo, cpu, mem, disk, graphics] = await Promise.all([
				si.osInfo(),
				si.cpu(),
				si.mem(),
				si.fsSize(),
				si.graphics()
			])

			return {
				os: {
					platform: osInfo.platform,
					distro: osInfo.distro,
					release: osInfo.release,
					arch: osInfo.arch
				},
				cpu: {
					manufacturer: cpu.manufacturer,
					brand: cpu.brand,
					cores: cpu.cores
				},
				memory: {
					total: mem.total,
					free: mem.free
				},
				disk: {
					total: disk[0]?.size || 0,
					free: disk[0]?.available || 0
				},
				graphics: {
					controllers: graphics.controllers.map(ctrl => ({
						model: ctrl.model,
						vram: ctrl.vram
					}))
				}
			}
		} catch (error) {
			console.error('Error getting system info:', error)
			return null
		}
	})
}
