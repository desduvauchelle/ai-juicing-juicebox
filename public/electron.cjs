const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		// transparent: true,
		// frame: false,
		// webPreferences: {
		// 	nodeIntegration: true,
		// 	contextIsolation: false
		// },
		backgroundColor: '#00ffffff',  // Fully transparent
		webPreferences: {
			preload: path.join(__dirname, '../dist/preload.js'), // Ensure this path is correct
			contextIsolation: true,
			enableRemoteModule: false,
		},
	});

	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				// 'Content-Security-Policy': [
				// 	"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
				// ],
			},
		});
	});

	const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
	mainWindow.loadURL(startUrl);
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
