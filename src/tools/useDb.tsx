import { useEffect, useState } from 'react'

type CrudOperations<T> = {
	create: (item: T) => void
	read: () => T[]
	update: (index: number, item: T) => void
	delete: (index: number) => void
	getByIndex: (index: number) => T | undefined
	getMany: (indexes: number[]) => T[]
}

function useDb<T>({
	dbName = 'myDb',
}: {
	dbName?: string
}): [T[], CrudOperations<T>] {
	const [state, setState] = useState<T[]>(() => {
		try {
			const stored = localStorage.getItem(dbName)
			return stored ? JSON.parse(stored) : []
		} catch {
			return []
		}
	})

	const create = (item: T) => {
		setState([...state, item])
	}

	const read = () => {
		return state
	}

	const update = (index: number, item: T) => {
		const newState = [...state]
		newState[index] = item
		setState(newState)
	}

	const deleteItem = (index: number) => {
		const newState = state.filter((_, i) => i !== index)
		setState(newState)
	}

	const getByIndex = (index: number) => {
		return state[index]
	}

	const getMany = (indexes: number[]) => {
		return indexes.map((i) => state[i]).filter((item) => item !== undefined) as T[]
	}

	useEffect(() => {
		localStorage.setItem(dbName, JSON.stringify(state))
	}, [dbName, state])

	return [state, { create, read, update, delete: deleteItem, getByIndex, getMany }]
}

export default useDb
