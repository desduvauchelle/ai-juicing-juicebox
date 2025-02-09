import express, { Request, Response } from 'express'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000

const frontendCodePath = path.join(__dirname, '../web')

// Serve static files from the 'public' directory
app.use(express.static(frontendCodePath))

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
