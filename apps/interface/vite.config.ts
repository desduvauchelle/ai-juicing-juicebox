import { defineConfig, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config: UserConfig = {
	base: './',
	plugins: [
		react(),
		tailwindcss()
	],
	build: {
		outDir: "./dist-interface",
		emptyOutDir: true
	},
	envDir: '.',  // This ensures Vite looks for .env files in the interface directory
}
config.build = config.build || {}
config.plugins = config.plugins || []

const destination = process.env.DESTINATION

if (destination === "desktop") {
	config.build.outDir = "../desktop/src/dist-interface"
}
if (destination === "github") {

	config.build.outDir = '../../dist-interface-github'
	config.base = '/ai-juicing-juicebox/'

	// Initialize define object with proper typing
	config.define = {
		'window.IS_STATIC': true
	}

	const allowedSources = [
		"http://localhost:*",
		"https://localhost:*",
		"http://127.0.0.1:*",
		"https://generativelanguage.googleapis.com",
		"https://api.anthropic.com",
		"https://api.openai.com",
		"https://api.deepseek.com",
		"https://api.mistral.ai"
	]
	config.plugins.push({
		name: 'html-transform',
		transformIndexHtml(html) {
			let newHtml = html
			if (process.env.DESTINATION === 'github') {
				newHtml = newHtml.replace(
					/<head>/i,
					`<head>
              <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' ${allowedSources.join(" ")}">`
				)
			}
			// Also add a global var called DESTINATION
			newHtml = newHtml.replace(
				/<head>/i,
				`<head>
					<script>
						window.DESTINATION = '${destination}';
					</script>`
			)
			return newHtml
		},
	})
}
if (destination === "server-web") {
	config.build.outDir = '../server-web/dist-interface'
}

// https://vite.dev/config/
export default defineConfig(config)
