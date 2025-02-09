import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


const config: defineConfig = {
	base: './',
	plugins: [
		react(),
		tailwindcss()
	],
	build: {
		outDir: "./dist-interface",
		emptyOutDir: true
	}
}
const destination = process.env.DESTINATION

if (destination === "desktop") {
	config.build.outDir = "../desktop/src/dist-interface"
}
if (destination === "github") {

	config.build.outDir = '../../dist-interface-github'
	config.base = '/ai-juicing-juicebox/'

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
			if (process.env.DESTINATION === 'github') {
				return html.replace(
					/<head>/i,
					`<head>
              <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' ${allowedSources.join(" ")}">`
				)
			}
			return html
		},
	})
}
if (destination === "server-web") {
	config.build.outDir = '../server-web/dist-interface'
}

// https://vite.dev/config/
export default defineConfig(config)
