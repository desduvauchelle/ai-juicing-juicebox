import React from 'react'
import { useState, useEffect } from 'react'
import LlmConfigForm from '../llm-config/LlmConfigForm'
import { useNavigate } from 'react-router-dom'
import { bridgeApi } from '../tools/bridgeApi'
import Logo from '../components/Logo'
import { InlineAlert } from '../components/InlineAlert'

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
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-500 to-green-600">
			<div className="p-10 bg-base-200 rounded-lg shadow-lg space-y-4 max-w-md w-full">
				<div className="flex items-center justify-center">
					<Logo />
				</div>
				<p>Free open source AI interaction software. Experience powerful AI tools. On the cloud or in the privacy of your computer.</p>

				{isChecking && (
					<InlineAlert type="info">Checking Ollama installation...</InlineAlert>
				)}
				{!isChecking && !ollamaInstalled && (
					<div className="mb-4">
						<p className="text-red-600">Ollama is not installed.</p>
						<button className="px-2 py-1 mr-2 bg-gray-200">Install Ollama</button>
					</div>
				)}
				{!isChecking && ollamaInstalled && (
					<InlineAlert type="success">Congrats! You already have Ollama installed.</InlineAlert>
				)}

				<div>
					<p className='text-xl text-center font-medium mb-2'>Setup your first AI</p>
					<LlmConfigForm
						onSubmit={() => {
							// Nav
							navigate('/chat')
						}} />
				</div>


			</div>
		</div>
	)
}

export default Welcome
