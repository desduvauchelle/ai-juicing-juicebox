import React, { useState } from 'react'
import IndexedDBService, { DbStores } from '../../../services/db'
import Button from '../../../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'

interface DatabaseItem {
	id?: number
}

interface ExportData {
	'llm-configs': DatabaseItem[]
	'conversations': DatabaseItem[]
	'folders': DatabaseItem[]
	'chats': DatabaseItem[]
}

const SettingsSettingsImportExport: React.FC = () => {
	const [isExporting, setIsExporting] = useState(false)
	const [isImporting, setIsImporting] = useState(false)
	const [includeChats, setIncludeChats] = useState(false)

	const handleExport = async () => {
		try {
			setIsExporting(true)
			const stores = ["llm-configs", "conversations", "folders"] as const
			const exportData = {} as ExportData

			// Export base stores
			for (const store of stores) {
				const dbService = new IndexedDBService<DatabaseItem>(store)
				exportData[store] = await dbService.getAll()
			}

			// Conditionally export chats
			if (includeChats) {
				const chatService = new IndexedDBService<DatabaseItem>("chats")
				exportData.chats = await chatService.getAll()
			} else {
				exportData.chats = []
			}

			const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `juicebox-backup-${new Date().toISOString()}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Export failed:', error)
			alert('Export failed. Please try again.')
		} finally {
			setIsExporting(false)
		}
	}

	const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			setIsImporting(true)
			const file = event.target.files?.[0]
			if (!file) return

			const text = await file.text()
			const importData = JSON.parse(text) as ExportData

			const isValidImportData = (data: unknown): data is ExportData => {
				const expectedStores = ["llm-configs", "conversations", "folders", "chats"]
				return typeof data === 'object'
					&& data !== null
					&& expectedStores.every(store =>
						store in data && Array.isArray((data as Record<string, unknown>)[store])
					)
			}

			if (!isValidImportData(importData)) {
				throw new Error('Invalid import data format')
			}

			for (const [storeName, items] of Object.entries(importData)) {
				const dbService = new IndexedDBService<DatabaseItem>(storeName as DbStores)
				for (const item of items) {
					await dbService.create(item)
				}
			}

			alert('Import successful! Please refresh the page.')
		} catch (error) {
			console.error('Import failed:', error)
			alert('Import failed. Please check the file format and try again.')
		} finally {
			setIsImporting(false)
			if (event.target) event.target.value = ''
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<input
					type="checkbox"
					id="includeChats"
					checked={includeChats}
					onChange={(e) => setIncludeChats(e.target.checked)}
					className=""
				/>
				<label htmlFor="includeChats" className="t">
					Include chat history in export
				</label>
			</div>

			<div className="flex gap-4 items-center">
				<Button
					theme="ghost"
					onClick={handleExport}
					disabled={isExporting}
					className="flex items-center gap-2">
					<FontAwesomeIcon icon={faDownload} className="h-5 w-5" />
					{isExporting ? 'Exporting...' : 'Export Data'}
				</Button>

				<div className="relative">
					<Button
						theme="ghost"
						disabled={isImporting}
						className="flex items-center gap-2">
						<FontAwesomeIcon icon={faUpload} className="h-5 w-5" />
						{isImporting ? 'Importing...' : 'Import Data'}
					</Button>
					<input
						aria-label="Import Data"
						type="file"
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
						accept=".json"
						onChange={handleImport}
						disabled={isImporting}
					/>
				</div>
			</div>
		</div>
	)
}

export default SettingsSettingsImportExport
