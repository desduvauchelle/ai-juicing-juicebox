import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const destination = process.env.DESTINATION
let buildDirectory = "./dist-interface"
if (destination === "desktop") {
	buildDirectory = "../desktop/src/dist-interface"
}
if (destination === "github") {
	buildDirectory = '../../dist-interface-github'
}
if (destination === "server-web") {
	buildDirectory = '../server-web/dist-interface'
}

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		react(),
		tailwindcss()
	],
	build: {
		outDir: buildDirectory,
		emptyOutDir: true
	}
})
