
export const LogoImage: React.FC<{ className?: string }> = ({ className }) => {
	return <img src="./logo.png" alt="Logo" className={`h-8 aspect-square ${className || ""}`} />
}

export const LogoText: React.FC<{ className?: string }> = ({ className }) => {
	return <span className={`font-black uppercase tracking-wide logo text-2xl ${className || ""}`}>Juicebar</span>
}
const Logo: React.FC<{ className?: string, imgClassName?: string }> = ({
	className,
	imgClassName
}) => {
	return <h2 className="pl-4 flex flex-row gap-2 items-center ">
		<LogoImage className={imgClassName} />
		<LogoText className={className} />
	</h2>
}



export default Logo
