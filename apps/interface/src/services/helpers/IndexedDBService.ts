const version = 2
const dbStores = ["llm-configs", "conversations", "folders", "chats"] as const
export type DbStores = typeof dbStores[number]

class IndexedDBService<T extends { id?: number }> {
	private dbName: string = "ai-juicing-juicebox"
	private storeName: DbStores
	private version: number = version
	private db: IDBDatabase | null = null
	private initPromise: Promise<void>

	constructor(storeName: DbStores) {
		this.storeName = storeName
		this.initPromise = this.init()
	}

	private async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(this.dbName, this.version)

			openRequest.onupgradeneeded = () => {
				const db = openRequest.result
				dbStores.forEach(store => {
					if (!db.objectStoreNames.contains(store)) {
						db.createObjectStore(store, { keyPath: 'id', autoIncrement: true })
					}
				})
			}

			openRequest.onsuccess = () => {
				this.db = openRequest.result
				resolve()
			}

			openRequest.onerror = () => {
				console.error(openRequest.error)
				reject(openRequest.error)
			}
		})
	}

	private async getStore(mode: IDBTransactionMode): Promise<IDBObjectStore> {
		await this.initPromise
		if (!this.db) throw new Error('Database not initialized')
		const transaction = this.db.transaction(this.storeName, mode)
		return transaction.objectStore(this.storeName)
	}

	create(item: T): Promise<T & { id: number }> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readwrite')
					delete item["id"]
					const request = store.add(item)

					request.onsuccess = () => {
						resolve({ ...item, id: request.result })
					}

					request.onerror = () => {
						console.error(request.error)
						reject(request.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}

	update(id: number, updatedItem: Partial<T>): Promise<void> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readwrite')
					const getRequest = store.get(id)

					getRequest.onsuccess = () => {
						const item = { ...getRequest.result, ...updatedItem }
						const putRequest = store.put(item)

						putRequest.onsuccess = () => {
							resolve()
						}

						putRequest.onerror = () => {
							reject(putRequest.error)
						}
					}

					getRequest.onerror = () => {
						reject(getRequest.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}

	delete(id: number): Promise<void> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readwrite')
					const request = store.delete(id)

					request.onsuccess = () => {
						resolve()
					}

					request.onerror = () => {
						reject(request.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}

	getAll(): Promise<Array<T & { id: number }>> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readonly')
					const request = store.getAll()

					request.onsuccess = () => {
						resolve(request.result)
					}

					request.onerror = () => {
						reject(request.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}

	getById(id: number): Promise<T & { id: number }> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readonly')
					const request = store.get(id)

					request.onsuccess = () => {
						if (request.result) resolve(request.result)
						else reject(new Error('Item not found'))
					}

					request.onerror = () => {
						reject(request.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}

	search(query: string, page: number = 1, limit: number = 10): Promise<Array<T & { id: number }>> {
		return new Promise((resolve, reject) => {
			(async () => {
				try {
					const store = await this.getStore('readonly')
					const request = store.openCursor()
					const results: Array<T & { id: number }> = []
					let skipped = 0

					request.onsuccess = () => {
						const cursor = request.result
						if (cursor) {
							const value = cursor.value
							const matchesSearch = query === '' || JSON.stringify(value).toLowerCase().includes(query.toLowerCase())
							if (matchesSearch) {
								if (skipped >= (page - 1) * limit && results.length < limit) {
									results.push(value)
								}
								skipped++
							}
							cursor.continue()
						} else {
							resolve(results)
						}
					}

					request.onerror = () => {
						reject(request.error)
					}
				} catch (error) {
					reject(error)
				}
			})()
		})
	}
}

export default IndexedDBService
