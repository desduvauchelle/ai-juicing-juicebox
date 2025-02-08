import { app, BrowserWindow, shell } from 'electron'
import * as path from 'path'
import { createMenu } from './menu'
import { registerIpcHandlers } from './ipc/registerIpc'
import { loadWindowState, saveWindowState } from './window-tools/windowResize'
// import createServer from './server/createServer'


declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string




// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
// Remove or ignore MAIN_WINDOW_WEBPACK_ENTRY and MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
// const isDev = !app.isPackaged; // Check if running in development
const isDev = process.env.NODE_ENV === 'development'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit()
}

const createWindow = (): void => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: false,
			webSecurity: !isDev,
			// webSecurity: false,
			// In production you could still set up a preload if needed:
			// preload: path.join(__dirname, 'preload.js')
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY // This is the magic constant from electron-forge
		},
	})

	// Load saved window state
	loadWindowState(mainWindow)

	// Save window state when it's resized or moved
	mainWindow.on('resize', () => saveWindowState(mainWindow))
	mainWindow.on('move', () => saveWindowState(mainWindow))

	if (isDev) {
		mainWindow.loadURL('http://localhost:5173')
	} else {
		// Changed production path to remove extra "src" folder
		const indexPath = path.join(process.resourcesPath, 'dist-web', 'index.html')
		mainWindow.loadFile(indexPath)
	}


	// if (isDev) {
	// 	mainWindow.webContents.openDevTools()
	// }

	createMenu(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	createWindow()
	registerIpcHandlers()
	// 	const usedPort = await createServer()
	// 	console.log(`
	// 		Polka server running on http://localhost:${usedPort}
	// `)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.




// Clean up when app quits
app.on('before-quit', () => {
	// if (ollamaProcess) {
	// 	ollamaProcess.kill();
	// 	ollamaProcess = null;
	// }
})
