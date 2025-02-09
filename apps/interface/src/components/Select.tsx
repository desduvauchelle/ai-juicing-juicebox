import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	ariaLabel?: string
	options: { value: string; label: string, disabled?: boolean }[]
	description?: string
}

const Select: React.FC<SelectProps> = ({ label, options, description, className, ...props }) => {
	return (
		<div className='w-full'>
			{label && <label className="block text-sm font-bold mb-2">
				{label}
			</label>}
			<select
				className={`select select-bordered w-full ${className}`}
				{...props}>
				{options.map((option) => (
					<option key={option.value}
						value={option.value}
						disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			{description && (
				<p className="opacity-70 text-xs italic mt-2">{description}</p>
			)}
		</div>
	)
}

export default Select
