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
		name: process.platform === 'linux' ? 'juicebox-ai' : 'Juicebox AI',
		executableName: process.platform === 'linux' ? 'juicebox-ai' : 'juicebox-ai',
		icon: path.join(process.cwd(), 'public', 'icons', 'icon'), // Ensure this path is correct
		extraResource: ['./src/dist-web', './public'],  // Update path to match source location
	}, // bypass type checking for custom property
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({}),
		new MakerZIP({}, ['darwin']),
		new MakerRpm({}),
		new MakerDeb({}),
		new MakerDMG({
			format: 'ULFO',
			icon: path.join(process.cwd(), 'public', 'icons', 'icon.icns')
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
						html: htmlPath, // htmlPath,
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
			// https://github.com/electron/fuses?tab=readme-ov-file#apple-silicon
			resetAdHocDarwinSignature: true,
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
