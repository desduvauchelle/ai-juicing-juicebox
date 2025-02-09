import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import createMainContextActionsFolders, { MainContextActionsFolders } from "./actions/mainContextActionsFolders"
import { IFileExplorerFolder } from "../../types/IFolder"
import { IAIService } from "../../types/IAIService"
import { UserSettingsService } from "../services/UserSettingsService"
import createMainContextActionsSettings, { MainContextActionsSettings, MainContextUserSettings } from "./actions/mainContextActionsSettings"
import createMainContextActionsAiServices, { MainContextActionsAiServices } from "./actions/mainContextActionsAiServices"
import { IConversation } from "../../types/IConversation"
import createMainContextActionsConversations, { MainContextActionsConversations } from "./actions/mainContextActionsConversations"
import ConversationService from "../services/ConversationService"



const setActions = <T,>(actions: T) => {
	return actions
}


export interface IMainContext {
	userSettings: MainContextUserSettings | undefined
	folders: IFileExplorerFolder[]
	aiServices: IAIService[],
	conversations: IConversation[],
	actions: {
		folders: MainContextActionsFolders,
		userSettings: MainContextActionsSettings,
		aiServices: MainContextActionsAiServices,
		conversations: MainContextActionsConversations
	}
}

const defaultMainContext: IMainContext = {
	userSettings: {},
	folders: [],
	aiServices: [],
	conversations: [],
	actions: {
		userSettings: createMainContextActionsSettings({ setUserSettings: setActions }),
		folders: createMainContextActionsFolders({ setFolders: setActions }),
		aiServices: createMainContextActionsAiServices({ setAiServices: setActions }),
		conversations: createMainContextActionsConversations({ setConversations: setActions }),
	},
}

const setUserTheme = (theme: string) => {
	document.documentElement.setAttribute('data-theme', theme)
}




const MainContext = createContext<IMainContext>(defaultMainContext)

export const MainContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [userSettings, setUserSettings] = useState<MainContextUserSettings | undefined>(defaultMainContext.userSettings)
	const [folders, setFolders] = useState<IFileExplorerFolder[]>(defaultMainContext.folders)
	const [aiServices, setAiServices] = useState<IAIService[]>(defaultMainContext.aiServices)
	const [conversations, setConversations] = useState<IConversation[]>(defaultMainContext.conversations)
	const initCompleteRef = useRef(false)

	//
	// INIT LOAD
	//
	useEffect(() => {
		if (initCompleteRef.current) return
		UserSettingsService.get()
			.then((settings) => {
				initCompleteRef.current = true
				console.log("User settings loaded", settings)
				if (!settings) return
				const { folders, aiServices, ...rest } = settings
				setUserSettings(rest)
				setFolders(folders || [])
				setAiServices(aiServices || [])
				if (rest.theme) setUserTheme(rest.theme || "dim")
			})
	}, [])
	// Load the conversations
	const fetchConversations = useCallback(async () => {
		const allChats = await ConversationService.getDefaults()
		// Sort using updatedAt newest to oldest
		const sortedChats = allChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
		setConversations(sortedChats)
	}, [])

	useEffect(() => {
		fetchConversations()
	}, [fetchConversations])


	useEffect(() => {
		if (!initCompleteRef.current) return
		if (userSettings?.theme) setUserTheme(userSettings.theme || "dim")
	}, [userSettings?.theme])

	//
	// SAVE TO STORAGE ON CHANGE
	//
	useEffect(() => {
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
		UserSettingsService.save({ aiServices })
	}, [aiServices])



	const folderActions = useCallback(
		() => {
			return createMainContextActionsFolders({ setFolders })
		},
		[])

	const llmConfigActions = useCallback(
		() => {
			return createMainContextActionsAiServices({ setAiServices })
		},
		[])

	const userSettingActions = useCallback(
		() => {
			return createMainContextActionsSettings({ setUserSettings })
		},
		[])

	const conversationActions = useCallback(
		() => {
			return createMainContextActionsConversations({ setConversations })
		},
		[])

	const contextValue: IMainContext = useMemo(
		() => ({
			userSettings,
			folders,
			aiServices,
			conversations,
			actions: {
				userSettings: userSettingActions(),
				folders: folderActions(),
				aiServices: llmConfigActions(),
				conversations: conversationActions()
			}
		}),
		[userSettings, folders, aiServices, conversations, userSettingActions, folderActions, llmConfigActions, conversationActions])

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
