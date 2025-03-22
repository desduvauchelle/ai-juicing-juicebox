import { forwardRef } from 'react'
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'

interface TextareaProps extends TextareaAutosizeProps {
	maxHeight?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
	return <TextareaAutosize
		ref={ref}
		className={`textarea ${className}`}
		{...props}
	/>
})



export default Textarea



interface TextareaWithLabelProps extends TextareaProps {
	label?: string
	description?: string
	topRight?: React.ReactNode
}

export const TextareaWithLabel: React.FC<TextareaWithLabelProps> = ({
	label,
	description,
	className,
	topRight,
	...props }) => {
	return <div className={className || ""}>
		<div className="flex flex-row w-full items-center mb-1">
			<label className="flex-grow text-sm font-bold">
				{label}
			</label>
			{topRight && <>
				{topRight}
			</>}
		</div>
		<Textarea className="textarea textarea-bordered w-full" {...props} />

		{description && (
			<p className="text-xs italic mt-2 opacity-70">{description}</p>
		)}
	</div>

}
