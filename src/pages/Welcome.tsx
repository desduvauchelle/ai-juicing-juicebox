import React from 'react'
import { useState, useEffect } from 'react'
import { MyLink } from '../components/Button'
import LlmConfigForm from '../llm-config/LlmConfigForm'
import { useNavigate } from 'react-router-dom'
import { bridgeApi } from '../tools/bridgeApi'

const Welcome: React.FC = () => {
	const [ollamaInstalled, setOllamaInstalled] = useState(true)
	const [isChecking, setIsChecking] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const check = async () => {
			setIsChecking(true)
			const installed = await bridgeApi.ollamaInstallCheck()
			setOllamaInstalled(installed)
			setIsChecking(false)
		}
		check()
	}, [])

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
			<div className="text-center p-10 bg-white rounded-lg shadow-lg space-y-4">
				<h1 className="text-5xl font-bold text-gray-800 mb-4">AI Juicing - Juicebox</h1>
				<p>Your interface with LLMs models, particularly local ones.</p>

				{isChecking && (
					<p>Checking Ollama installation...</p>
				)}
				{!isChecking && !ollamaInstalled && (
					<div className="mb-4">
						<p className="text-red-600">Ollama is not installed.</p>
						<button className="px-2 py-1 mr-2 bg-gray-200">Install Ollama</button>
					</div>
				)}
				{!isChecking && ollamaInstalled && (
					<p className="mb-4 text-green-600">Congrats! You already have Ollama installed.</p>
				)}

				<div>
					<p>Setup your first AI</p>
					<LlmConfigForm
						onSubmit={() => {
							// Nav
							navigate('/chat')
						}} />
				</div>

				<MyLink href="#chat" theme="primary" isButton>
					Get started
				</MyLink>
			</div>
		</div>
	)
}

export default Welcome
