import Markdown from 'react-markdown'


const MyMarkdown: React.FC<{ children: string }> = ({ children }) => {
	return <Markdown className="markdown">{children}</Markdown>
}

export default MyMarkdown
