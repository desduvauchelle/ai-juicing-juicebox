import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize'


interface TextareaProps extends TextareaAutosizeProps {
	maxHeight?: number
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
	return <TextareaAutosize
		className={`appearance-none leading-tight focus:outline-none focus:shadow-outline ${className}`}
		{...props}
	/>
}

export default Textarea
