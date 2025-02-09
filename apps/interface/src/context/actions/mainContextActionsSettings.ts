import { UserSettings } from "../../../types/UserSettings"
import { UserSettingsService } from "../../services/UserSettingsService"

type SetState<T> = React.Dispatch<React.SetStateAction<T | undefined>>

export type MainContextUserSettings = Omit<UserSettings, 'folders' | 'aiServices'>

const createMainContextActionsSettings = ({
	setUserSettings,
}: {
	setUserSettings: SetState<MainContextUserSettings | undefined>,
}) => ({
	update: async (updates: Partial<MainContextUserSettings>) => {
		const newSettings = await UserSettingsService.save(updates)
		setUserSettings(newSettings)
	},
})

export type MainContextActionsSettings = ReturnType<typeof createMainContextActionsSettings>
export default createMainContextActionsSettings
