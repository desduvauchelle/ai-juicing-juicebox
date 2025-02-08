import { app, BrowserWindow, dialog, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron'

function createMenu(mainWindow: BrowserWindow) {
	const isMac = process.platform === 'darwin'

	const template: Array<(MenuItemConstructorOptions) | (MenuItem)> = []

	if (isMac) {
		template.push({
			label: app.name,
			submenu: [
				// { role: 'about' },
				{
					label: `About ${app.name}`,
					click: () =>
						dialog.showMessageBox({
							title: app.name,
							message: `${app.name} Version v${app.getVersion()}\n\nCopyright © 2024 Jan`,
						}),
				},
				{ type: 'separator' },
				// {
				// 	label: 'Check for Updates...',
				// 	click: () => {
				// 		autoUpdater.checkForUpdates()
				// 	}
				// },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' }
			],
		})
	}

	template.push({
		label: 'File',
		submenu: [
			// {
			// 	label: 'Return Home',
			// 	accelerator: 'CmdOrCtrl+H',
			// 	click: () => {
			// 		// Close this window and open the home window

			// 	}
			// },
			// {
			// 	label: 'Open File...',
			// 	click: () => {
			// 		// Open file dialog
			// 	}
			// },
			// {
			// 	label: 'Open Folder...',
			// 	click: () => {
			// 		// Open folder dialog
			// 	}
			// },
			// { type: 'separator' },
			// {
			// 	label: 'Save',
			// 	click: () => {
			// 		// Save file
			// 	}
			// },
			// {
			// 	label: 'Save As...',
			// 	click: () => {
			// 		// Save file as
			// 	}
			// },
			{ type: 'separator' },
			{
				label: 'Close',
				click: () => {
					mainWindow.close()
				}
			}
		]
	})

	template.push({
		label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'delete' },
			{ type: 'separator' },
			{ role: 'selectAll' }
		]
	})

	template.push({
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	})

	template.push({
		role: 'window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
			{ type: 'separator' },
			{ role: 'front' }
		]
	})

	template.push({
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click: async () => {
					await shell.openExternal('https://github.com/desduvauchelle/ai-juicing-juicebox')
				}
			},
			// {
			// 	label: 'Check for Updates...',
			// 	click: () => {
			// 		autoUpdater.checkForUpdates()
			// 	}
			// }
		]
	})

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}

export { createMenu }
