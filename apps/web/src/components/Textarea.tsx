import { forwardRef } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

interface TextareaProps extends TextareaAutosizeProps {
	maxHeight?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
	return <TextareaAutosize
		ref={ref}
		className={`appearance-none leading-tight focus:outline-none focus:shadow-outline ${className}`}
		{...props}
	/>
})

export default Textarea
