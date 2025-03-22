import { FC, useLayoutEffect, useState } from "react"
import { useMainContext } from "../../context/MainContext"
import Button from "../Button"
import Input from "../Input"
import { TextareaWithLabel } from "../Textarea"
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const ModalUserPrompts: FC<{
	isOpen: boolean
	onSelect: (prompt: string) => void
	onCancel: () => void
}> = ({ isOpen, onSelect, onCancel }) => {
	const mainContext = useMainContext()
	const systemPrompts = mainContext.userSettings?.systemPrompts || []

	const [newPromptName, setNewPromptName] = useState<string>("")
	const [newPromptContent, setNewPromptContent] = useState<string>("")
	const [selectedPrompt, setSelectedPrompt] = useState<{ id: string; name: string; prompt: string } | null>(null)
	const [isCreating, setIsCreating] = useState(false)

	// show dialog when isOpen becomes true
	useLayoutEffect(() => {
		if (isOpen) {
			const modal = document.getElementById("modal-pick-system-prompts") as HTMLDialogElement
			modal?.showModal()
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleCreatePrompt = async () => {
		if (!newPromptName || !newPromptContent) return
		const response = await mainContext.actions.systemPrompts.create({ name: newPromptName, prompt: newPromptContent })
		if (!response.prompt) {
			window.alert("Failed to create prompt")
			return
		}
		setNewPromptName("")
		setNewPromptContent("")
		setIsCreating(false)
		onSelect(response.prompt.prompt)
		const modal = document.getElementById("modal-pick-system-prompts") as HTMLDialogElement
		modal?.close()
	}

	const handleUpdatePrompt = async () => {
		if (!selectedPrompt) return
		await mainContext.actions.systemPrompts.update(selectedPrompt.id, selectedPrompt)
		setSelectedPrompt(null)
	}

	const handleDeletePrompt = async () => {
		if (!selectedPrompt) return
		await mainContext.actions.systemPrompts.delete(selectedPrompt.id)
		setSelectedPrompt(null)
	}

	return <dialog id="modal-pick-system-prompts" className="modal ">
		<div className="modal-box">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-2xl" onClick={() => {
					const modal = document.getElementById("modal-pick-system-prompts") as HTMLDialogElement
					modal?.close()
					onCancel()
				}}>✕</button>
			</form>
			<div className="flex flex-col gap-4">
				<div className="flex flex-row gap-2 items-center justify-between pr-3">
					<h3 className="font-bold text-lg">
						Your system prompts
					</h3>
					<Button className="btn-sm" theme="primary" isOutline onClick={() => setIsCreating(true)}>
						New Prompt
					</Button>
				</div>

				{!systemPrompts.length && <>
					<p className="italic opacity-60">Store your favorite prompts and stop repeating yourself.</p>
					<p>
						<Button className="btn-sm" theme="primary" onClick={() => setIsCreating(true)}>
							Create your first system prompt
						</Button>
					</p>
				</>}

				<ul>
					{systemPrompts.map((prompt) => (
						<li key={prompt.id} className="flex flex-row gap-2 items-center hover:bg-base-200 p-2 rounded-lg">
							<button
								className={`py-2 w-full block flex-grow text-left ${selectedPrompt?.id === prompt.id ? "btn-active" : ""}`}
								onClick={() => {
									onSelect(prompt.prompt)
									const modal = document.getElementById("modal-pick-system-prompts") as HTMLDialogElement
									modal?.close()

								}}>
								{prompt.name}
							</button>
							<Button
								theme="ghost"
								className="btn-sm"
								onClick={() => {
									setSelectedPrompt(prompt)
								}}>
								<FontAwesomeIcon icon={faPen} />
							</Button>
						</li>
					))}
				</ul>

				{/* Create Prompt */}
				{isCreating && (
					<form
						className="bg-base-200 p-4 rounded-lg flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							handleCreatePrompt()
						}}>
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-lg">Create Prompt</h3>
							<Button theme="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
						</div>
						<Input
							label="Name"
							type="text"
							placeholder="Prompt Name"
							value={newPromptName}
							onChange={(e) => setNewPromptName(e.target.value)}
						/>
						<TextareaWithLabel
							label="System prompt"
							placeholder="Prompt Content"
							value={newPromptContent}
							onChange={(e) => setNewPromptContent(e.target.value)}
						/>
						<Button theme="primary" onClick={handleCreatePrompt}>Create</Button>
					</form>
				)}

				{/* Update / Delete Prompt */}
				{selectedPrompt && (
					<form
						className="bg-base-200 p-4 rounded-lg flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault()
							handleUpdatePrompt()
						}}>
						<div className="flex justify-between items-center">
							<h3 className="font-bold text-lg">Update Prompt</h3>
							<Button theme="ghost" onClick={() => setSelectedPrompt(null)}>Cancel</Button>
						</div>
						<Input
							label="Name"
							type="text"
							placeholder="Prompt Name"
							value={selectedPrompt.name}
							onChange={(e) => setSelectedPrompt({ ...selectedPrompt, name: e.target.value })}
						/>
						<TextareaWithLabel
							label="System prompt"
							placeholder="Prompt Content"
							value={selectedPrompt.prompt}
							onChange={(e) => setSelectedPrompt({ ...selectedPrompt, prompt: e.target.value })}
						/>
						<div className="flex flex-row gap-2">
							<Button theme="primary" className="btn-sm" onClick={handleUpdatePrompt}>Update</Button>
							<Button theme="danger" className="btn-sm" onClick={handleDeletePrompt}>
								<FontAwesomeIcon icon={faTrash} />
							</Button>

						</div>
					</form>
				)}
			</div>
		</div>
		<form method="dialog" className="modal-backdrop">
			<button onClick={() => {
				const modal = document.getElementById("modal-pick-system-prompts") as HTMLDialogElement
				modal?.close()
				onCancel()
			}}>Close</button>
		</form>
	</dialog>

}

export default ModalUserPrompts
