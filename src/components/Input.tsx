import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	description?: string
}

const Input: React.FC<InputProps> = ({ label, description, className, ...props }) => {
	return <div className={className || ""}>
		<label className="block text-gray-700 text-sm font-bold mb-2">
			{label}
		</label>
		<input
			className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			{...props}
		/>
		{description && (
			<p className="text-gray-600 text-xs italic mt-2">{description}</p>
		)}
	</div>

}

export default Input
