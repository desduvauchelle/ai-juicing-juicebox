import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	ariaLabel?: string
	options: { value: string; label: string, disabled?: boolean }[]
	description?: string
	topRight?: React.ReactNode
}

const Select: React.FC<SelectProps> = ({ label, options, description, className, topRight, ...props }) => {
	return (
		<div className='w-full'>
			{(label || topRight) && <div className="flex flex-row w-full items-center mb-1">
				<label className="flex-grow text-sm font-bold">
					{label}
				</label>
				{topRight && <>
					{topRight}
				</>}
			</div>}
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
