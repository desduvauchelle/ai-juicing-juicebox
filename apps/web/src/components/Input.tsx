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
			className="input input-bordered w-full"
			{...props}
		/>
		{description && (
			<p className="text-xs italic mt-2 opacity-70">{description}</p>
		)}
	</div>

}

export default Input
