import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	description?: string
}

const Input: React.FC<InputProps> = ({ label, description, className, ...props }) => {
	return <div className={className || ""}>
		<label className="block text-sm font-bold mb-2">
			{label}
		</label>
		<input
			className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
			{...props}
		/>
		{description && (
			<p className="text-xs italic mt-2 opacity-70">{description}</p>
		)}
	</div>

}

export default Input
