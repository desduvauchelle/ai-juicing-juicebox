import { app } from 'electron'
import { promises as fs } from 'fs'
import * as path from 'path'

// Define the path to the storage file safely within the userData folder
const storagePath = path.join(app.getPath('userData'))




const get = async <T>({
	fileName,
	relativeLocation = "",
	defaultData
}: {
	fileName: string
	relativeLocation?: string
	defaultData: T
}): Promise<T> => {

	try {
		const filePath = path.join(storagePath, relativeLocation, `${fileName}.json`)
		const data = await fs.readFile(filePath, 'utf-8')
		return {
			...defaultData,
			...JSON.parse(data)
		}
	} catch {
		return defaultData
	}
}
const save = async <T>({
	fileName,
	relativeLocation = "",
	partialData
}: {
	fileName: string
	relativeLocation?: string
	partialData: T
}): Promise<T> => {

	try {
		const savedData = await get({
			fileName,
			relativeLocation,
			defaultData: {}
		})
		const fileBasePath = path.join(storagePath, relativeLocation, fileName)
		const newStorage = { ...savedData, ...partialData }
		const data = JSON.stringify(newStorage, null, 2)
		const tempPath = storagePath + '.tmp'
		await fs.writeFile(tempPath, data, 'utf-8')
		await fs.rename(tempPath, storagePath)
		return newStorage
	} catch (error) {
		console.error('Error saving storage:', error)
		// Cleanup the temporary file if it exists
		try {
			await fs.unlink(storagePath + '.tmp')

		} catch {
			/* ignore cleanup errors */
		}
		throw error
	}
}
const storage = {
	get,
	save
}

export default storage
