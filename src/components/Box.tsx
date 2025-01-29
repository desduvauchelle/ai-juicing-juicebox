

const Box: React.FC<{
	children: React.ReactNode
	title?: string
}> = ({ children, title }) => {
	return (
		<div className="bg-base-200 p-4 rounded flex flex-col space-y-4">
			{title && <h2 className="text-xl">{title}</h2>}
			{children}
		</div>
	)
}

export default Box
