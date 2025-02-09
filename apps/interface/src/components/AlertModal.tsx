import { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'

interface AlertModalProps {
	id: string
	title?: string
	message?: string
	children?: ReactNode
}

export const AlertModal = ({ id, title, message, children }: AlertModalProps) => {
	return (
		<dialog id={id} className="modal">
			<div className="modal-box">
				<form method="dialog">
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</button>
				</form>
				{title && <h3 className="font-bold text-lg">{title}</h3>}
				{message && <p className="py-4">{message}</p>}
				{children}
			</div>
		</dialog>
	)
}

// Helper functions to show/hide modal
export const showModal = (id: string) => {
	const modal = document.getElementById(id) as HTMLDialogElement | null
	modal?.showModal()
}

export const hideModal = (id: string) => {
	const modal = document.getElementById(id) as HTMLDialogElement | null
	modal?.close()
}

// Temporary modal component for async alerts
const TempModal = ({ id, message }: { id: string; message: string }) => (
	<dialog id={id} className="modal">
		<div className="modal-box">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<p className="py-4">{message}</p>
			<form method="dialog" className="modal-action">
				<button className="btn">OK</button>
			</form>
		</div>
	</dialog>
)

// Async alert function
export const asyncAlert = (message: string): Promise<void> => {
	return new Promise((resolve) => {
		const tempId = `alert-${Math.random().toString(36).slice(2)}`

		// Create temporary container and render modal
		const container = document.createElement('div')
		document.body.appendChild(container)

		const root = ReactDOM.createRoot(container)
		root.render(<TempModal id={tempId} message={message} />)

		const modal = document.getElementById(tempId) as HTMLDialogElement
		modal.addEventListener('close', () => {
			root.unmount()
			document.body.removeChild(container)
			resolve()
		})

		modal.showModal()
	})
}
