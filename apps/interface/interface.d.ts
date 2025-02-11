export type Globals = {
	IS_STATIC?: boolean
}

declare global {
	type GlobalKeys = keyof Globals
	type GlobalValues = Globals[GlobalKeys]

	interface Window {
		IS_STATIC?: boolean
	}
}

declare const IS_STATIC: Globals['IS_STATIC'] | undefined
