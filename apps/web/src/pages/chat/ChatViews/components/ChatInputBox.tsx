import { ChangeEvent, KeyboardEvent, TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react'

interface ChatInputBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	startingRows?: number
	maxRows?: number
	isDisabled?: boolean
	isLoading?: boolean
	onSubmit?: () => void
}

export const ChatInputBox = forwardRef<HTMLTextAreaElement, ChatInputBoxProps>(({
	startingRows = 1,
	maxRows = 5,
	isDisabled = false,
	isLoading = false,
	className = "",
	onSubmit,
	value,
	...props
}, ref) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)

	// Simplify ref handling
	useEffect(() => {
		if (!textareaRef.current) return
		if (typeof ref === 'function') {
			ref(textareaRef.current)
		} else if (ref) {
			ref.current = textareaRef.current
		}
	}, [ref])

	const adjustHeight = () => {
		const textarea = textareaRef.current
		if (!textarea) return

		const lineHeight = 24
		const maxHeight = lineHeight * maxRows
		const minHeight = lineHeight * startingRows

		// Reset height to minHeight first
		textarea.style.height = `${minHeight}px`

		// Get the scroll height and determine the new height
		const scrollHeight = Math.max(minHeight, textarea.scrollHeight)
		const newHeight = Math.min(scrollHeight, maxHeight)

		textarea.style.height = `${newHeight}px`
		textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
	}


	useEffect(() => {
		adjustHeight()
	}, [value])

	const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (props.onChange) {
			props.onChange(e)
		}
		adjustHeight()
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			if (e.shiftKey) {
				// Shift+Enter: let the default behavior (new line) happen
				return
			}
			// Enter without shift: prevent new line and submit
			e.preventDefault()
			onSubmit?.()
		}
	}

	return <textarea
		ref={textareaRef}
		value={value}
		onChange={handleTextareaChange}
		disabled={isDisabled || isLoading}
		className={`w-full px-4 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
		onKeyDown={handleKeyDown}
		rows={startingRows}
		style={{
			height: `${24 * startingRows}px`,
			maxHeight: `${24 * maxRows}px`
		}}
		{...props}
	/>
})

ChatInputBox.displayName = 'ChatInputBox'
