import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label: string
	options: { value: string; label: string }[]
	description?: string
}

const Select: React.FC<SelectProps> = ({ label, options, description, ...props }) => {
	return (
		<div>
			<label className="block text-gray-700 text-sm font-bold mb-2">
				{label}
			</label>
			<select
				className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{description && (
				<p className="text-gray-600 text-xs italic mt-2">{description}</p>
			)}
		</div>
	)
}

export default Select
