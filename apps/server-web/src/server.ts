import dotenv from 'dotenv'
dotenv.config()

import express, { Request, Response } from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'

const app = express()
const port = process.env.PORT || 3000

console.log(process.env.ENV)

const frontendCodePath = path.join(__dirname, '../dist-interface')

// Conditional serving of static files or proxy to Vite server
if (process.env.ENV === 'development') {
	// Proxy all non-API requests to Vite dev server
	app.use('/', createProxyMiddleware({
		target: 'http://localhost:5173',
		changeOrigin: true,
		ws: true, // Enable websocket proxy for HMR
		pathFilter: (path) => !path.includes('/api')  // Proxy all non-API requests
	}))
} else {
	// Serve static files in production
	app.use(express.static(frontendCodePath))
}

// Example API endpoint
app.get('/api/data', (req: Request, res: Response) => {
	const data = { message: 'Hello from the API!' }
	res.json(data)
})

app.post("/api/ai/text", (req: Request, res: Response) => {
	const data = { message: 'Hello from the API!' }
	res.json(data)
})

// Catch-all route for SPAs
app.get('*', (req: Request, res: Response) => {
	res.sendFile(path.join(frontendCodePath, 'index.html'))
})

// Basic error handling (improve this for production)
app.use((err: Error, req: Request, res: Response, next: any) => {  // Type 'next'
	console.error(err.stack)
	res.status(500).send('Something went wrong!')
})


app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})
