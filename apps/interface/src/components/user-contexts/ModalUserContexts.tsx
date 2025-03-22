import { FC, useLayoutEffect, useState } from "react"
import { useMainContext } from "../../context/MainContext"
import Button from "../Button"
import Input from "../Input"
import { TextareaWithLabel } from "../Textarea"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { UserSettingsContext } from "../../../types/UserSettings"

export const ModalUserContexts: FC<{
	isOpen: boolean
	onSelect: (context: UserSettingsContext) => void
	onCancel: () => void
}> = ({ isOpen, onSelect, onCancel }) => {
	const mainContext = useMainContext()
	const contexts = mainContext.userSettings?.contexts || []

	const [newContextName, setNewContextName] = useState<string>("")
	const [newContextContent, setNewContextContent] = useState<string>("")
	const [selectedContext, setSelectedContext] = useState<{ id: string; name: string; context: string } | null>(null)
	const [isCreating, setIsCreating] = useState(false)

	useLayoutEffect(() => {
		if (isOpen) {
			const modal = document.getElementById("modal-pick-contexts") as HTMLDialogElement
			modal?.showModal()
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleCreateContext = async () => {
		if (!newContextName || !newContextContent) return
		const response = await mainContext.actions.contexts.create({ name: newContextName, context: newContextContent })
		if (!response.context) {
			window.alert("Failed to create context")
			return
		}
		setNewContextName("")
		setNewContextContent("")
		setIsCreating(false)
		onSelect(response.context)
		const modal = document.getElementById("modal-pick-contexts") as HTMLDialogElement
		modal?.close()
	}

	const handleUpdateContext = async () => {
		if (!selectedContext) return
		await mainContext.actions.contexts.update(selectedContext.id, selectedContext)
		setSelectedContext(null)
	}

	const handleDeleteContext = async () => {
		if (!selectedContext) return
		await mainContext.actions.contexts.delete(selectedContext.id)
		setSelectedContext(null)
	}

	return <dialog id="modal-pick-contexts" className="modal">
		<div className="modal-box">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-2xl" onClick={() => {
					const modal = document.getElementById("modal-pick-contexts") as HTMLDialogElement
					modal?.close()
					onCancel()
				}}>✕</button>
			</form>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-2 items-center justify-between pr-3">
					<h3 className="font-bold text-lg">
						Your contexts
					</h3>
					<Button className="btn-sm" theme="primary" isOutline onClick={() => setIsCreating(true)}>
						New Context
					</Button>
				</div>

				{!contexts.length && <>
					<p className="italic opacity-60">Contexts allow you to save information so you don't have to repeat yourself all the time. Store information about your project, company, blog, personal,...</p>
					<p>
						<Button className="btn-sm" theme="primary" onClick={() => setIsCreating(true)}>
							Create your first context
						</Button>
					</p>
				</>}

				<ul>
					{contexts.map((context) => (
						<li key={context.id} className="flex flex-row gap-2 items-center hover:bg-base-200 p-2 rounded-lg">
							<button
								className={`py-2 w-full block flex-grow text-left ${selectedContext?.id === context.id ? "btn-active" : ""}`}
								onClick={() => {
									onSelect(context)
									const modal = document.getElementById("modal-pick-contexts") as HTMLDialogElement
									modal?.close()
								}}>
								{context.name}
							</button>
							<Button
								theme="ghost"
								className="btn-sm"
								onClick={() => {
									setSelectedContext(context)
								}}>
								<FontAwesomeIcon icon={faPen} />
							</Button>
						</li>
					))}
				</ul>

				{isCreating && (
					<form
						className="bg-base-200 p-4 rounded-lg flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							handleCreateContext()
						}}>
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-lg">Create Context</h3>
							<Button theme="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
						</div>
						<Input
							label="Name"
							type="text"
							placeholder="Context Name"
							value={newContextName}
							onChange={(e) => setNewContextName(e.target.value)}
						/>
						<TextareaWithLabel
							label="Context"
							placeholder="Context Content"
							value={newContextContent}
							onChange={(e) => setNewContextContent(e.target.value)}
						/>
						<Button theme="primary" onClick={handleCreateContext}>Create</Button>
					</form>
				)}

				{selectedContext && (
					<form
						className="bg-base-200 p-4 rounded-lg flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							handleUpdateContext()
						}}>
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-lg">Update Context</h3>
							<Button theme="ghost" onClick={() => setSelectedContext(null)}>Cancel</Button>
						</div>
						<Input
							label="Name"
							type="text"
							placeholder="Context Name"
							value={selectedContext.name}
							onChange={(e) => setSelectedContext({ ...selectedContext, name: e.target.value })}
						/>
						<TextareaWithLabel
							label="Context"
							placeholder="Context Content"
							value={selectedContext.context}
							onChange={(e) => setSelectedContext({ ...selectedContext, context: e.target.value })}
						/>
						<div className="flex flex-row gap-2">
							<Button theme="primary" className="btn-sm" onClick={handleUpdateContext}>Update</Button>
							<Button theme="danger" className="btn-sm" onClick={handleDeleteContext}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>
						</div>
					</form>
				)}
			</div>
		</div>
		<form method="dialog" className="modal-backdrop">
			<button onClick={() => {
				const modal = document.getElementById("modal-pick-contexts") as HTMLDialogElement
				modal?.close()
				onCancel()
			}}>Close</button>
		</form>
	</dialog>
}

export default ModalUserContexts
