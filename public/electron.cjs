const { app, BrowserWindow, ipcMain } = require('electron');
const { execSync, spawn } = require('child_process');
const path = require('path');
const si = require('systeminformation');
const { JSDOM } = require('jsdom');
const { autoUpdater } = require('electron-updater');
const { createMenu } = require('./menu.cjs');

let ollamaProcess = null;

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		titleBarStyle: 'hidden',
		webPreferences: {
			preload: process.env.ELECTRON_START_URL
				? path.join(__dirname, './preload.cjs')  // Development
				: path.join(__dirname, '../dist/preload.cjs'),  // Production
			contextIsolation: true,
			enableRemoteModule: false,
			nodeIntegration: true,
		},
	});

	const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
	mainWindow.loadURL(startUrl);

	// Create the application menu
	createMenu(mainWindow);

	// Setup auto-updater events
	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;

	autoUpdater.on('checking-for-update', () => {
		mainWindow.webContents.send('update-status', 'checking');
	});

	autoUpdater.on('update-available', (info) => {
		mainWindow.webContents.send('update-status', 'available', info);
	});

	autoUpdater.on('update-not-available', (info) => {
		mainWindow.webContents.send('update-status', 'not-available', info);
	});

	autoUpdater.on('download-progress', (progressObj) => {
		mainWindow.webContents.send('update-status', 'progress', progressObj);
	});

	autoUpdater.on('update-downloaded', (info) => {
		mainWindow.webContents.send('update-status', 'downloaded', info);
	});

	autoUpdater.on('error', (err) => {
		mainWindow.webContents.send('update-status', 'error', err);
	});

	// Check for updates immediately
	autoUpdater.checkForUpdates();

	// Check for updates every hour
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 60 * 60 * 1000);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// Add this before the other IPC handlers
ipcMain.handle('system-info-get', async () => {
	try {
		const [osInfo, cpu, mem, disk, graphics] = await Promise.all([
			si.osInfo(),
			si.cpu(),
			si.mem(),
			si.fsSize(),
			si.graphics()
		]);

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
		};
	} catch (error) {
		console.error('Error getting system info:', error);
		return null;
	}
});

// Register IPC handlers
ipcMain.handle('ollama-install-check', () => {
	try {
		execSync('ollama --version', { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
});

ipcMain.handle('ollama-server-toggle', async (_, start) => {
	try {
		if (start) {
			if (!ollamaProcess) {
				ollamaProcess = spawn('ollama', ['serve'], {
					detached: false,
					stdio: 'pipe'
				});

				ollamaProcess.on('error', (error) => {
					console.error('Failed to start ollama:', error);
					ollamaProcess = null;
				});

				// Wait a bit for the server to start
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		} else {
			if (ollamaProcess) {
				ollamaProcess.kill();
				ollamaProcess = null;
			} else {
				execSync('pkill ollama', { stdio: 'ignore' });
			}
		}
		return true;
	} catch (error) {
		console.error('Error toggling server:', error);
		return false;
	}
});

ipcMain.handle('ollama-model-download', async (_, modelId) => {
	try {
		const result = execSync(`ollama download ${modelId}`, { stdio: 'pipe' });
		return result.toString();
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
		return 'An unknown error occurred (ollama-model-download)';
	}
});

ipcMain.handle('ollama-model-remove', async (_, modelId) => {
	try {
		const result = execSync(`ollama rm ${modelId}`, { stdio: 'pipe' });
		return result.toString();
	} catch (error) {
		if (error instanceof Error) {
			return error.message;
		}
		return 'An unknown error occurred (ollama-model-remove)';
	}
});

ipcMain.handle('ollama-model-remote', async () => {
	try {
		console.log('Fetching models from ollama.ai...');
		const response = await fetch('https://ollama.ai/library');
		const html = await response.text();

		const dom = new JSDOM(html);
		const doc = dom.window.document;
		// Check to see if it finds searchResults id in the doc

		const formSection = doc.querySelector('ul');
		// Log all the found lists in the formSection
		console.log('Found formSection:', formSection);

		const searchResults = doc.querySelector('#searchresults');
		if (!searchResults) {
			console.error('Failed to find search results');
			return [];
		}
		const modelCards = doc.querySelectorAll('#searchresults ul li');
		console.log('Found model cards:', modelCards.length);


		const models = Array.from(doc.querySelectorAll('.model-card')).map(card => {
			return {
				name: card.querySelector('.name')?.textContent?.trim() || '',
				description: card.querySelector('.description')?.textContent?.trim() || '',
				tags: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent?.trim() || '')
			};
		});

		return models;
	} catch (error) {
		console.error('Error fetching remote models:', error);
		return [];
	}
});

// Add these IPC handlers after the existing ones
ipcMain.handle('check-for-updates', () => {
	autoUpdater.checkForUpdates();
});

ipcMain.handle('quit-and-install', () => {
	autoUpdater.quitAndInstall();
});

// Clean up when app quits
app.on('before-quit', () => {
	// if (ollamaProcess) {
	// 	ollamaProcess.kill();
	// 	ollamaProcess = null;
	// }
});
