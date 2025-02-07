import { json } from 'body-parser'
import polka from 'polka'
import aiAiText from './endpoints/ai/ai-text'


const PORT = 51412


const createServer = async () => {
	const server = polka()
		.use(json())
		.use((req, res, next) => {
			// Add CORS headers
			res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173') // Allow only your frontend
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
			if (req.method === 'OPTIONS') {
				res.writeHead(204)
				res.end()
				return
			}
			next()
		})

	server.get('/', (req, res) => {
		res.end('Hello, world!')
	})
	server.post('/ai/text', aiAiText)

	server.listen(PORT, () => {
		console.log(`Polka server running on http://localhost:${PORT}`)
	})
	return PORT
}

export default createServer
