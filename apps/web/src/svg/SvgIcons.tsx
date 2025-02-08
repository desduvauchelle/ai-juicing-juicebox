// https://feathericons.com/?query=link

export const IconFolder: React.FC<{ color?: string, className?: string }> = ({ color = "inherit", className = "h-8" }) => {
	return <svg
		stroke={color}
		className={`aspect-square ${className}`}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
}

export const IconFolderMinus: React.FC<{ color?: string, className?: string }> = ({ color = "inherit", className = "h-8" }) => {
	return <svg
		stroke={color}
		className={`aspect-square ${className}`}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="9" y1="14" x2="15" y2="14"></line>
	</svg>
}


export const IconChat: React.FC<{ color: string, className?: string }> = ({ color, className = "h-8" }) => {
	return <svg
		stroke={color}
		className={`aspect-square ${className}`}
		viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
	><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
	</svg>
}
