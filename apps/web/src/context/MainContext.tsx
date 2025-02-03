import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { IFileExplorerFolder } from "../../types/IFolder"
import { ILlmConfig } from "../../types/ILlmConfig"
import mainContextActionsFolders, { MainContextActionsFolders } from "./actions/mainContextActionsFolders"

const setActions = <T,>(actions: T) => {
	return actions
}

interface IMainContext {
	theme: {
		name: string
	},
	settings: {
		quitOllamaOnClose: boolean
	},
	folders: IFileExplorerFolder[]
	llmConfigs: ILlmConfig[],
	actions: {
		folders: MainContextActionsFolders
	}
}

const defaultMainContext: IMainContext = {
	theme: {
		name: ""
	},
	settings: {
		quitOllamaOnClose: false
	},
	folders: [],
	llmConfigs: [],
	actions: {
		folders: mainContextActionsFolders({ setFolders: setActions })
	},
}


const MainContext = createContext<IMainContext>(defaultMainContext)

export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [theme, setTheme] = useState(defaultMainContext.theme)
	const [settings, setSettings] = useState(defaultMainContext.settings)
	const [folders, setFolders] = useState<IFileExplorerFolder[]>(defaultMainContext.folders)
	const [llmConfigs, setLlmConfigs] = useState(defaultMainContext.llmConfigs)

	const folderActions = useCallback(
		() => mainContextActionsFolders({ setFolders }),
		[setFolders])

	const contextValue: IMainContext = useMemo(
		() => ({
			theme,
			settings,
			folders,
			llmConfigs,
			actions: {
				folders: folderActions()
			}
		}),
		[theme, settings, folders, llmConfigs, folderActions])

	return <MainContext.Provider value={contextValue}>
		{children}
	</MainContext.Provider>

}

export const useMainContext = () => {
	const context = useContext(MainContext)
	if (!context) {
		throw new Error("useMainContext must be used within a MainContextProvider")
	}
	return context
}
