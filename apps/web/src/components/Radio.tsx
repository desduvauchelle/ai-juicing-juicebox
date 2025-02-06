import React, { useMemo } from 'react'

type RadioTheme = "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "error" | "custom"

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	theme?: RadioTheme
	isSmall?: boolean
	isBig?: boolean
	checked?: boolean
	setTextToLeft?: boolean
}

const Radio: React.FC<RadioProps> = ({
	label,
	theme = 'primary',
	isSmall,
	isBig,
	className = '',
	checked = false,
	onChange,
	setTextToLeft = false,
	...props
}) => {
	const classes = useMemo(() => {
		const classes = ['radio']

		// Add theme class
		switch (theme) {
			case "primary":
				classes.push("radio-primary")
				break
			case "secondary":
				classes.push("radio-secondary")
				break
			case "accent":
				classes.push("radio-accent")
				break
			case "success":
				classes.push("radio-success")
				break
			case "warning":
				classes.push("radio-warning")
				break
			case "info":
				classes.push("radio-info")
				break
			case "error":
				classes.push("radio-error")
				break
			case "custom":
				break
			default:
				classes.push("radio-primary")
				break
		}

		// Add size classes
		if (isSmall) classes.push('radio-sm')
		if (isBig) classes.push('radio-lg')
		if (className) classes.push(className)

		return classes.join(' ')
	}, [theme, isSmall, isBig, className])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) {
			onChange(e)
		}
	}

	return (
		<div className="form-control">
			<label className="label cursor-pointer flex flex-row items-center gap-2">
				{setTextToLeft && <span className="label-text">{label}</span>}
				<input
					type="radio"
					className={classes}
					checked={checked}
					onChange={handleChange}
					{...props}
				/>
				{!setTextToLeft && <span className="label-text">{label}</span>}
			</label>
		</div>
	)
}

export default Radio
