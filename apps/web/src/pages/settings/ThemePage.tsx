import React, { useEffect } from 'react'
import { useMainContext } from '../../context/MainContext'
import Select from '../../components/Select'
import Box from '../../components/Box'

const THEME_OPTIONS = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "cupcake", label: "Cupcake" },
	{ value: "bumblebee", label: "Bumblebee" },
	{ value: "emerald", label: "Emerald" },
	{ value: "corporate", label: "Corporate" },
	{ value: "synthwave", label: "Synthwave" },
	{ value: "retro", label: "Retro" },
	{ value: "cyberpunk", label: "Cyberpunk" },
	{ value: "valentine", label: "Valentine" },
	{ value: "halloween", label: "Halloween" },
	{ value: "garden", label: "Garden" },
	{ value: "forest", label: "Forest" },
	{ value: "aqua", label: "Aqua" },
	{ value: "lofi", label: "Lo-Fi" },
	{ value: "pastel", label: "Pastel" },
	{ value: "fantasy", label: "Fantasy" },
	{ value: "wireframe", label: "Wireframe" },
	{ value: "black", label: "Black" },
	{ value: "luxury", label: "Luxury" },
	{ value: "dracula", label: "Dracula" },
	{ value: "cmyk", label: "CMYK" },
	{ value: "autumn", label: "Autumn" },
	{ value: "business", label: "Business" },
	{ value: "acid", label: "Acid" },
	{ value: "lemonade", label: "Lemonade" },
	{ value: "night", label: "Night" },
	{ value: "coffee", label: "Coffee" },
	{ value: "winter", label: "Winter" },
	{ value: "dim", label: "Dim" },
	{ value: "nord", label: "Nord" },
	{ value: "sunset", label: "Sunset" },
]

const ThemePage: React.FC = () => {
	const { userSettings, actions } = useMainContext()

	const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const newTheme = event.target.value
		actions.userSettings.update({ theme: newTheme })
	}



	return (
		<div className="w-full max-w-2xl mx-auto px-4 space-y-8">
			<div className="flex flex-row gap-2 items-center pt-8">
				<h1 className="text-2xl font-bold flex-grow">Theme Settings</h1>
			</div>

			<Box title="Theme selection">
				<Select
					label="Select Theme"
					options={THEME_OPTIONS}
					value={userSettings?.theme || 'dim'}
					onChange={handleThemeChange}
					description="Choose your preferred theme for the application"
				/>
			</Box>
		</div>
	)
}

export default ThemePage
