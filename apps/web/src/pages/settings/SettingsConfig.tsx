import Box from "../../components/Box"
import SettingsSettingsImportExport from "./settings/SettingsSettingsImportExport"


const SettingsConfig: React.FC = () => {

	return <div className="space-y-6 max-w-2xl w-full">
		<h1 className="text-3xl font-bold">Settings</h1>
		<Box title="Import <> Export">
			<SettingsSettingsImportExport />
		</Box>
	</div>
}

export default SettingsConfig
