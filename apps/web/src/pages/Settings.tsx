import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MyLink } from '../components/Button'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LlmConfigs from './settings/LlmConfigs'
import OllamaPage from './settings/OllamaPage'
import Logo from '../components/Logo'
import SettingsConfig from './settings/SettingsConfig'

const Settings: React.FC = () => {
	return <div className="flex h-screen">
		<nav className="min-w-3xs max-w-[250px] w-full bg-base-200 pt-8 flex flex-col gap-4">
			<Logo />
			<MyLink href="/chat" theme="custom" className='w-full text-left px-4 pr-2 py-2 hover:bg-base-300'>
				<FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back to Chat
			</MyLink>
			<ul className="menu rounded-box w-full">
				{
					[
						{
							href: "/settings/theme",
							text: "Theme"
						},
						{
							href: "/settings/settings",
							text: "Settings"
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
							<MyLink theme="custom" href={href} className="">{text}</MyLink>
						</li>
					})}

			</ul>
		</nav>
		<main className="w-full p-4 h-full overflow-y-auto">
			<Routes>
				<Route path="/theme" element={<>Theme</>} />
				<Route path="/llm-configs" element={<LlmConfigs />} />
				<Route path="/settings" element={<SettingsConfig />} />
				<Route path="/ollama" element={<OllamaPage />} />
			</Routes>
		</main>
	</div>

}

export default Settings
