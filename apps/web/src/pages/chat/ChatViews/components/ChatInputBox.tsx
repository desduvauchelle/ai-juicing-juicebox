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
	const combinedRef = (node: HTMLTextAreaElement) => {
		textareaRef.current = node
		if (typeof ref === 'function') ref(node)
		else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
	}

	const adjustHeight = () => {
		const textarea = textareaRef.current
		if (!textarea) return

		const lineHeight = 24
		const maxHeight = lineHeight * maxRows

		// Reset height to auto to get the actual content height
		textarea.style.height = 'auto'

		if (textarea.scrollHeight <= maxHeight) {
			// Content fits within maxRows - adjust height to content
			textarea.style.height = `${textarea.scrollHeight}px`
			textarea.style.overflowY = 'hidden'
		} else {
			// Content exceeds maxRows - set to maxHeight and enable scrolling
			textarea.style.height = `${maxHeight}px`
			textarea.style.overflowY = 'auto'
		}
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
		ref={combinedRef}
		value={value}
		onChange={handleTextareaChange}
		disabled={isDisabled || isLoading}
		className={`w-full px-4 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
		onKeyDown={handleKeyDown}
		style={{
			minHeight: `${24 * startingRows}px`,
			maxHeight: `${24 * maxRows}px`
		}}
		{...props}
	/>
})

ChatInputBox.displayName = 'ChatInputBox'
