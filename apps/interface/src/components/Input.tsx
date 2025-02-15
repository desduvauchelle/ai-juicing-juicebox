import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	description?: string
	topRight?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
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
