import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { MakerDMG } from '@electron-forge/maker-dmg'

import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'
import path from 'path'

// Determine HTML path based on environment
const isDev = process.env.NODE_ENV === 'development'
const htmlPath = isDev ? '../web/index.html' : './src/dist-web/index.html'

const config: ForgeConfig = {
	packagerConfig: {
		asar: true,
		name: 'Juicebox AI',
		executableName: 'Juicebox AI',
		icon: path.join(process.cwd(), 'public', 'icons', 'icon'), // Ensure this path is correct
		extraResource: ['./src/dist-web', './public']  // Update path to match source location
	}, // bypass type checking for custom property
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerRpm({}),
		new MakerDeb({}),
		new MakerDMG({
			format: 'ULFO',
			icon: path.join(process.cwd(), 'public', 'icons', 'icon.icns'),
			background: path.join(process.cwd(), 'public', 'icons', 'dmg-background.png'),
			contents: [
				{
					x: 130,
					y: 220,
					type: 'file',
					path: path.join(process.cwd(), 'out', 'Juicebox AI-darwin-x64', 'Juicebox AI.app')
				},
				{
					x: 410,
					y: 220,
					type: 'link',
					path: '/Applications'
				}
			]
		})
	],
	plugins: [
		new AutoUnpackNativesPlugin({}),
		new WebpackPlugin({
			mainConfig,
			renderer: {
				config: rendererConfig,
				entryPoints: [
					{
						html: htmlPath,
						js: './src/renderer.ts',
						name: 'main_window',
						preload: {
							js: './src/preload.ts',
						},
					},
				],
			},
		}),
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
	publishers: [
		{
			name: '@electron-forge/publisher-github',
			config: {
				repository: {
					owner: 'desduvauchelle',
					name: 'ai-juicing-juicebox'
				},
				prerelease: true,
				generateReleaseNotes: true
			}
		}
	]
}

export default config
