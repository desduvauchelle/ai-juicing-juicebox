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
import { UserSettingsContext, UserSettingsSystemPrompt } from "../../types/UserSettings"



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
		conversations: MainContextActionsConversations,
		systemPrompts: {
			create: (_prompt: Omit<UserSettingsSystemPrompt, 'id'>) => Promise<{ error?: string, prompt?: UserSettingsSystemPrompt }>,
			update: (_id: string, _prompt: Partial<UserSettingsSystemPrompt>) => Promise<{ error?: string, prompt?: UserSettingsSystemPrompt }>,
			delete: (_id: string) => Promise<{ error?: string }>
		},
		contexts: {
			create: (_context: Omit<UserSettingsContext, 'id'>) => Promise<{ error?: string, context?: UserSettingsContext }>,
			update: (_id: string, _context: Partial<UserSettingsContext>) => Promise<{ error?: string, context?: UserSettingsContext }>,
			delete: (_id: string) => Promise<{ error?: string }>
		}
	},

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
		systemPrompts: {
			create: async () => { return { error: "Not implemented" } },
			update: async () => { return { error: "Not implemented" } },
			delete: async () => { return { error: "Not implemented" } }
		},
		contexts: {
			create: async () => { return { error: "Not implemented" } },
			update: async () => { return { error: "Not implemented" } },
			delete: async () => { return { error: "Not implemented" } }
		}
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
				if (!rest.defaultChatHistoryCount) rest.defaultChatHistoryCount = 20
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

	const systemPromptsCreate = useCallback(async (_prompt: Omit<UserSettingsSystemPrompt, 'id'>) => {
		const newPrompt = { id: crypto.randomUUID(), ..._prompt }
		setUserSettings(prev => ({
			...prev,
			systemPrompts: [...(prev?.systemPrompts || []), newPrompt]
		}))
		return { prompt: newPrompt }
	}, [])

	const systemPromptsUpdate = useCallback(async (_id: string, _prompt: Partial<UserSettingsSystemPrompt>) => {
		setUserSettings(prev => ({
			...prev,
			systemPrompts: prev?.systemPrompts?.map(p =>
				p.id === _id ? { ...p, ..._prompt } : p
			) || []
		}))
		return { prompt: { id: _id, ..._prompt } as UserSettingsSystemPrompt }
	}, [])

	const systemPromptsDelete = useCallback(async (_id: string) => {
		setUserSettings(prev => ({
			...prev,
			systemPrompts: prev?.systemPrompts?.filter(p => p.id !== _id) || []
		}))
		return {}
	}, [])

	const userContextsCreate = useCallback(async (_context: Omit<UserSettingsContext, 'id'>) => {
		const newContext = { id: crypto.randomUUID(), ..._context }
		setUserSettings(prev => ({
			...prev,
			contexts: [...(prev?.contexts || []), newContext]
		}))
		return { context: newContext }
	}, [])

	const userContextsUpdate = useCallback(async (_id: string, _context: Partial<UserSettingsContext>) => {
		setUserSettings(prev => ({
			...prev,
			contexts: prev?.contexts?.map(c =>
				c.id === _id ? { ...c, ..._context } : c
			) || []
		}))
		return { context: { id: _id, ..._context } as UserSettingsContext }
	}, [])

	const userContextsDelete = useCallback(async (_id: string) => {
		setUserSettings(prev => ({
			...prev,
			contexts: prev?.contexts?.filter(c => c.id !== _id) || []
		}))
		return {}
	}, [])

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
				conversations: conversationActions(),
				systemPrompts: {
					create: systemPromptsCreate,
					update: systemPromptsUpdate,
					delete: systemPromptsDelete
				},
				contexts: {
					create: userContextsCreate,
					update: userContextsUpdate,
					delete: userContextsDelete
				}
			}
		}),
		[userSettings, folders, aiServices, conversations, userSettingActions, folderActions, llmConfigActions, conversationActions, systemPromptsCreate, systemPromptsUpdate, systemPromptsDelete, userContextsCreate, userContextsUpdate, userContextsDelete])

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
