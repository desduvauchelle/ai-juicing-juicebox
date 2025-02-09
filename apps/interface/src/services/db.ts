import type { DbStores } from './helpers/IndexedDBService'
import IndexedDBService from './helpers/IndexedDBService'
// import StoreService from './helpers/StoreService'

function createDBService<T extends { id?: number }>(storeName: DbStores) {
	return new IndexedDBService<T>(storeName)
}

export default createDBService
