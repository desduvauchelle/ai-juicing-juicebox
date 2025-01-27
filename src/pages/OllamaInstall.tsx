import React from 'react'
import { MyLink } from '../components/Button'

const Welcome: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="text-center p-10 bg-white rounded-lg shadow-lg">
				<h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to Ollama Web</h1>
				<p className="text-lg text-gray-600 mb-8">
					Your journey to a better web experience starts here.
				</p>
				<MyLink href="#chat" theme="primary" isButton>
					Get started
				</MyLink>

			</div>
		</div>
	)
}

export default Welcome
