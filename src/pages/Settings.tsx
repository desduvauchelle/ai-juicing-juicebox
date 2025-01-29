import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MyLink } from '../components/Button'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LlmConfigs from './settings/LlmConfigs'
import OllamaPage from './settings/OllamaPage'
import Logo from '../components/Logo'

const Settings: React.FC = () => {
	return <div className="flex h-screen">
		<nav className="w-1/5 bg-base-200 pt-8 flex flex-col gap-8">
			<Logo />
			<MyLink href="/chat" theme="ghost" isButton className='w-full'>
				<FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back to Chat
			</MyLink>
			<ul className='flex flex-col gap-1'>
				{
					[
						{
							href: "/settings/theme",
							text: "Theme"
						},
						{
							href: "/settings/import-export",
							text: "Import/Export"
						},
						{
							href: "/settings/ollama",
							text: "Ollama"
						},
						{
							href: "/settings/llm-configs",
							text: "LLM Configs"
						}
					].map(({ href, text }) => {
						return <li key={href}>
							<MyLink href={href} className="w-full hover:bg-base-300 block py-1 px-4">{text}</MyLink>
						</li>
					})}

			</ul>
		</nav>
		<main className="w-full p-4 h-full overflow-y-auto">
			<Routes>
				<Route path="/theme" element={<>Theme</>} />
				<Route path="/llm-configs" element={<LlmConfigs />} />
				<Route path="/import-export" element={<>Import/Export Page</>} />
				<Route path="/ollama" element={<OllamaPage />} />
			</Routes>
		</main>
	</div>

}

export default Settings
