import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, ReactNode, useMemo, forwardRef, useState } from "react"
import { Link, LinkProps } from "react-router-dom"
import { bridgeApi } from "../tools/bridgeApi"

type ButtonThemes = "primary" | "secondary" | "danger" | "success" | "warning" | "info" | "dark" | "light" | "link" | "custom" | "ghost" | "blank"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	theme: ButtonThemes,
	children: ReactNode,
	isLoading?: boolean,
	isLoadingContent?: ReactNode,
	isBig?: boolean,
	isSmall?: boolean,
	isExtraSmall?: boolean,
	isOutline?: boolean,
	tooltip?: string,
	tooltipPosition?: "top" | "bottom" | "left" | "right",
	textToCopy?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
	theme,
	children,
	className,
	isLoading,
	isBig,
	isSmall,
	isOutline,
	tooltip,
	tooltipPosition,
	isExtraSmall,
	textToCopy,
	isLoadingContent = <FontAwesomeIcon icon={faCircleNotch} spin />,
	onClick,
	...rest
}, ref) => {
	const [tempText, setTempText] = useState<string | null>(null)

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!textToCopy) {
			onClick?.(e)
			return
		}

		await navigator.clipboard.writeText(textToCopy)
		setTempText("Copied!")
		setTimeout(() => {
			setTempText(null)
		}, 5000)

		onClick?.(e)
	}

	const customClassName = useMemo(() => {
		let themeClassName = "btn "
		if (isOutline) {
			themeClassName += " btn-outline"
		}
		switch (theme) {
			case "primary":
				themeClassName += " btn-primary"
				break
			case "secondary":
				themeClassName += " btn-secondary"
				break
			case "danger":
				themeClassName += " btn-error"
				break
			case "success":
				themeClassName += " btn-success"
				break
			case "warning":
				themeClassName += " btn-warning"
				break
			case "info":
				themeClassName += " btn-info"
				break
			case "dark":
				themeClassName += " btn-dark"
				break
			case "light":
				themeClassName += " btn-light"
				break
			case "link":
				themeClassName += " btn-link"
				break
			case "ghost":
				themeClassName += " btn-ghost"
				break
			case "custom":
				themeClassName = ""
				break
			default:
				themeClassName += " btn-primary"
				break
		}
		if (className) {
			themeClassName += " " + className
		}

		if (isBig) {
			themeClassName += " btn-lg"
		}
		if (isSmall) {
			themeClassName += " btn-sm"
		}
		if (isExtraSmall) {
			themeClassName += " btn-xs"
		}
		return themeClassName
	}, [isOutline, theme, className, isBig, isSmall, isExtraSmall])

	const attributes: ButtonHTMLAttributes<HTMLButtonElement> = {
		...rest,
		className: customClassName,
		type: textToCopy ? "button" : rest.type,
		onClick: handleClick
	}
	if (isLoading) {
		attributes.disabled = true
	}
	if (tooltip) {
		// @ts-expect-error Not sure how to type fix this
		attributes["data-tip"] = tooltip
		attributes.className += " tooltip"
		if (tooltipPosition) {
			attributes.className += " tooltip-" + tooltipPosition
		}
	}

	return <button ref={ref} {...attributes}>{isLoading ? isLoadingContent : (tempText || children)}</button>
})

Button.displayName = 'Button'

export default Button

export const MyLink: FC<AnchorHTMLAttributes<HTMLAnchorElement> & {
	theme?: ButtonThemes,
	isButton?: boolean,
	isOutline?: boolean,
	children: ReactNode,
	isLoading?: boolean,
	isBig?: boolean,
	isSmall?: boolean,
}> = ({
	theme,
	children,
	className,
	isLoading,
	isOutline,
	isBig,
	isButton,
	href,
	isSmall,
	...rest
}) => {
		const customClassName = useMemo(() => {
			let themeClassName = "link"
			if (isOutline) {
				themeClassName += " link-outline"
			}
			switch (theme) {
				case "primary":
					themeClassName += " link-primary"
					break
				case "secondary":
					themeClassName += " link-secondary"
					break
				case "danger":
					themeClassName += " link-danger"
					break
				case "success":
					themeClassName += " link-success"
					break
				case "warning":
					themeClassName += " link-warning"
					break
				case "info":
					themeClassName += " link-info"
					break
				case "dark":
					themeClassName += " link-dark"
					break
				case "light":
					themeClassName += " link-light"
					break
				case "link":
					themeClassName += " link-link"
					break
				case "custom":
					themeClassName = ""
					break
				case "ghost":
					themeClassName += " link-ghost"
					break
				case "blank":
					themeClassName = ""
					break
				default:
					themeClassName += ""
					break
			}

			if (className) {
				themeClassName += " " + className
			}
			if (isBig) {
				themeClassName += " btn-lg"
			}
			if (isSmall) {
				themeClassName += " btn-sm"
			}
			if (isButton) {
				themeClassName = themeClassName.replace(/link/g, "btn")
			}
			return themeClassName
		}, [isOutline, theme, className, isBig, isSmall, isButton])

		const attributes: LinkProps = {
			...rest,
			to: href || "#",
			className: customClassName
		}

		if (window.electron && href?.startsWith("http")) {
			attributes.onClick = (e) => {
				e.preventDefault()
				bridgeApi.goToUrl(href)
			}
		}

		if (isLoading) {
			attributes["aria-disabled"] = true
		}

		return <Link {...attributes}>{children}</Link>
	}
