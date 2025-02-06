import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import mainContextActionsFolders, { MainContextActionsFolders } from "./actions/mainContextActionsFolders"
import { IFileExplorerFolder } from "../../types/IFolder"
import { ILlmConfig } from "../../types/ILlmConfig"
import { UserSettings } from "../../types/UserSettings"
import { UserSettingsService, UserSettingsServiceType } from "../services/UserSettingsService"



const setActions = <T,>(actions: T) => {
	return actions
}


type BaseUserSettings = Omit<UserSettings, 'folders' | 'llmConfigs'>
interface IMainContext {
	userSettings: BaseUserSettings
	folders: IFileExplorerFolder[]
	llmConfigs: ILlmConfig[],
	actions: {
		folders: MainContextActionsFolders,
		userSettings: UserSettingsServiceType
	}
}

const defaultMainContext: IMainContext = {
	userSettings: {},
	folders: [],
	llmConfigs: [],
	actions: {
		userSettings: UserSettingsService,
		folders: mainContextActionsFolders({ setFolders: setActions })
	},
}


const MainContext = createContext<IMainContext>(defaultMainContext)

export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [userSettings, setUserSettings] = useState<BaseUserSettings>(defaultMainContext.userSettings)
	const [folders, setFolders] = useState<IFileExplorerFolder[]>(defaultMainContext.folders)
	const [llmConfigs, setLlmConfigs] = useState<ILlmConfig[]>(defaultMainContext.llmConfigs)
	const initCompleteRef = useRef(false)
	// On load of component, use the UserSettingsService to get the user settings
	useEffect(() => {
		UserSettingsService.get()
			.then((settings) => {
				initCompleteRef.current = true
				console.log("User settings loaded", settings)
				if (!settings) return
				const { folders, llmConfigs, ...rest } = settings
				setUserSettings(rest)
				setFolders(folders || [])
				setLlmConfigs(llmConfigs || [])
			})
	}, [])

	// On change of user settings, save the user settings using the UserSettingsService
	useEffect(() => {
		if (!initCompleteRef.current) return
		UserSettingsService.save(userSettings)
	}, [userSettings])
	// Same for folders
	useEffect(() => {
		if (!initCompleteRef.current) return
		UserSettingsService.save({ folders })
	}, [folders])
	// Same for LLM configs
	useEffect(() => {
		if (!initCompleteRef.current) return
		UserSettingsService.save({ llmConfigs })
	}, [llmConfigs])

	const folderActions = useCallback(
		() => {
			return mainContextActionsFolders({ setFolders })
		},
		[])

	const contextValue: IMainContext = useMemo(
		() => ({
			userSettings,
			folders,
			llmConfigs,
			actions: {
				userSettings: UserSettingsService,
				folders: folderActions()
			}
		}),
		[userSettings, folders, llmConfigs, folderActions])

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
