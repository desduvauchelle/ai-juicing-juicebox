const Logo: React.FC<{ className?: string, imgClassName?: string }> = ({
	className,
	imgClassName
}) => {
	return <h2 className="pl-4 flex flex-row gap-2 items-center ">
		<img src="./logo.png" alt="Logo" className={`h-8 w-8${imgClassName || ""}`} />
		<span className={`font-black uppercase tracking-wide logo text-2xl ${className || ""}`}>Juicebox</span>
	</h2>
}

export default Logo
