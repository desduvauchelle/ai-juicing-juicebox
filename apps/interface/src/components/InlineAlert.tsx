import { FC, ReactNode } from 'react'

type AlertType = 'default' | 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
	type?: AlertType
	children: ReactNode
	title?: string
	description?: string
	buttons?: ReactNode
	className?: string
}

const InfoIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		className="stroke-current h-6 w-6 shrink-0">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
)

const SuccessIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6 shrink-0 stroke-current"
		fill="none"
		viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
)

const WarningIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6 shrink-0 stroke-current"
		fill="none"
		viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
		/>
	</svg>
)

const ErrorIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6 shrink-0 stroke-current"
		fill="none"
		viewBox="0 0 24 24">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
)

const getAlertIcon = (type: AlertType) => {
	switch (type) {
		case 'info':
			return <InfoIcon />
		case 'success':
			return <SuccessIcon />
		case 'warning':
			return <WarningIcon />
		case 'error':
			return <ErrorIcon />
		default:
			return <InfoIcon />
	}
}

const getAlertClasses = (type: AlertType, hasTitle: boolean, extraClasses: string = '') => {
	const baseClasses = 'alert'
	const titleClasses = hasTitle ? 'shadow-lg' : ''

	const typeClasses = {
		default: '',
		info: 'alert-info',
		success: 'alert-success',
		warning: 'alert-warning',
		error: 'alert-error'
	}[type]

	return [baseClasses, typeClasses, titleClasses, extraClasses]
		.filter(Boolean)
		.join(' ')
		.trim()
}

export const InlineAlert: FC<AlertProps> = ({
	type = 'default',
	children,
	title,
	description,
	buttons,
	className = '',
}) => {
	const alertClassName = getAlertClasses(type, !!title, className)

	return (
		<div role="alert" className={alertClassName}>
			{getAlertIcon(type)}
			{title ? (
				<div>
					<h3 className="font-bold">{title}</h3>
					<div className="text-xs">{description || children}</div>
				</div>
			) : (
				<span>{children}</span>
			)}
			{buttons && <div>{buttons}</div>}
		</div>
	)
}
