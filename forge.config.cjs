const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
	packagerConfig: {
		asar: true,
		icon: path.join(__dirname, 'public', 'icons', 'icon'), // Ensure this path is correct
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-dmg',
			config: {
				icon: './public/icons/icon.icns',
				format: 'ULFO',
				name: 'JuiceBox AI',
				overwrite: true,

			}
		},
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'Juicebox AI',
				authors: 'Denis Duvauchelle',
				exe: 'ai-juicing-juicebox.exe',
				setupIcon: path.join(__dirname, 'public', 'icons', 'icon.ico'),
				iconUrl: 'https://raw.githubusercontent.com/desduvauchelle/ai-juicing-juicebox/main/public/icons/icon.ico',
				loadingGif: path.join(__dirname, 'public', 'icons', 'loading.gif'),
				setupExe: 'AI-Juicing-JuiceBox-Setup.exe',
				noMsi: true
			}
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				license: 'MIT',
				options: {
					license: 'MIT'
				}
			}
		},
	],
	plugins: [
		{
			name: '@electron-forge/plugin-auto-unpack-natives',
			config: {},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
};
