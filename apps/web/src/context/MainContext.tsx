import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import createMainContextActionsFolders, { MainContextActionsFolders } from "./actions/mainContextActionsFolders"
import { IFileExplorerFolder } from "../../types/IFolder"
import { ILlmConfig } from "../../types/ILlmConfig"
import { UserSettingsService } from "../services/UserSettingsService"
import createMainContextActionsLlmConfigs, { MainContextActionsLlmConfigs } from "./actions/mainContextActionsLlmConfigs"
import createMainContextActionsSettings, { MainContextActionsSettings, MainContextUserSettings } from "./actions/mainContextActionsSettings"



const setActions = <T,>(actions: T) => {
	return actions
}


interface IMainContext {
	userSettings: MainContextUserSettings | undefined
	folders: IFileExplorerFolder[]
	llmConfigs: ILlmConfig[],
	actions: {
		folders: MainContextActionsFolders,
		userSettings: MainContextActionsSettings,
		llmConfigs: MainContextActionsLlmConfigs
	}
}

const defaultMainContext: IMainContext = {
	userSettings: {},
	folders: [],
	llmConfigs: [],
	actions: {
		userSettings: createMainContextActionsSettings({ setUserSettings: setActions }),
		folders: createMainContextActionsFolders({ setFolders: setActions }),
		llmConfigs: createMainContextActionsLlmConfigs({ setLlmConfigs: setActions }),
	},
}

const setUserTheme = (theme: string) => {
	document.documentElement.setAttribute('data-theme', theme)
}


const MainContext = createContext<IMainContext>(defaultMainContext)

export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [userSettings, setUserSettings] = useState<MainContextUserSettings | undefined>(defaultMainContext.userSettings)
	const [folders, setFolders] = useState<IFileExplorerFolder[]>(defaultMainContext.folders)
	const [llmConfigs, setLlmConfigs] = useState<ILlmConfig[]>(defaultMainContext.llmConfigs)
	const initCompleteRef = useRef(false)

	//
	// INIT LOAD
	//
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
				if (rest.theme) setUserTheme(rest.theme || "dim")
			})
	}, [])

	useEffect(() => {
		if (!initCompleteRef.current) return
		if (userSettings?.theme) setUserTheme(userSettings.theme || "dim")
	}, [userSettings?.theme])

	//
	// SAVE TO STORAGE ON CHANGE
	//
	useEffect(() => {
		console.log("Saving user settings", userSettings)
		if (!initCompleteRef.current) return
		if (!userSettings) return
		UserSettingsService.save(userSettings)
	}, [userSettings])

	useEffect(() => {
		if (!initCompleteRef.current) return
		UserSettingsService.save({ folders })
	}, [folders])

	useEffect(() => {
		if (!initCompleteRef.current) return
		UserSettingsService.save({ llmConfigs })
	}, [llmConfigs])



	const folderActions = useCallback(
		() => {
			return createMainContextActionsFolders({ setFolders })
		},
		[])

	const llmConfigActions = useCallback(
		() => {
			return createMainContextActionsLlmConfigs({ setLlmConfigs })
		},
		[])

	const userSettingActions = useCallback(
		() => {
			return createMainContextActionsSettings({ setUserSettings })
		},
		[])

	const contextValue: IMainContext = useMemo(
		() => ({
			userSettings,
			folders,
			llmConfigs,
			actions: {
				userSettings: userSettingActions(),
				folders: folderActions(),
				llmConfigs: llmConfigActions()
			}
		}),
		[userSettings, folders, llmConfigs, userSettingActions, folderActions, llmConfigActions])

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
