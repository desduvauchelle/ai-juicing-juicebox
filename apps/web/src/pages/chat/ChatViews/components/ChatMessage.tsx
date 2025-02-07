import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import Markdown from "react-markdown"
import Button from "../../../../components/Button"
import { useConversation } from "../../../../context/ConversationContext"
import { IConversationChat } from "../../../../../types/IConversation"



const ChatMessage: React.FC<{
	chat: IConversationChat,
	maxWidth?: string
}> = ({ chat, maxWidth }) => {
	const [showThinking, setShowThinking] = useState(true)
	const conversationContext = useConversation()



	const parsedText = useMemo<{ thinking?: string, response?: string, isThinking?: boolean }>(() => {
		if (!chat.text) {
			return {
				response: ''
			}
		}
		if (!chat.text.includes("<think>")) {
			return {
				response: chat.text
			}
		}

		if (chat.text.includes("<think>") && chat.text.includes("</think>")) {
			const [_, thinking, response] = chat.text.match(/<think>(.*?)<\/think>(.*)/s) || []
			return {
				thinking: thinking,
				response: response
			}
		}

		if (chat.text.includes("<think>")) {
			const [_, thinking] = chat.text.match(/<think>(.*)$/s) || []
			return {
				thinking: thinking,
				isThinking: true
			}
		}

		return {
			response: chat.text
		}
	}, [chat.text])

	if (chat.role === "user") {
		return <div className={`${maxWidth || ""} group pt-12 px-4 lg:px-0`}>

			<div className="flex justify-end items-start gap-4">
				<div className="">
					<Button
						theme="custom"
						isOutline
						isSmall
						className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 p-2 hover:text-red-500"
						onClick={() => conversationContext?.actions.chat.delete(chat.id)}>
						<FontAwesomeIcon icon={faTrash} />
					</Button>
				</div>
				<div className="max-w-lg px-4 rounded-xl bg-base-300">
					<div className="markdown">
						{parsedText.thinking && <>
							<Button
								theme="ghost"
								isSmall
								onClick={() => setShowThinking(!showThinking)}
								className={`mb-2 ${parsedText.isThinking ? 'animate-pulse' : ''}`}>
								{showThinking ? 'Hide thinking' : 'Show thinking'}
							</Button>
							{showThinking && <>
								<div className="opacity-50 mb-6">
									<Markdown>
										{parsedText.thinking}
									</Markdown>
								</div>
							</>}
						</>}
						{parsedText.response && <Markdown>{parsedText.response}</Markdown>}
					</div>
				</div>
			</div>
		</div>
	}

	return <div className={`${maxWidth || ""} group pt-4 px-4 lg:px-0`}>

		<div className="flex flex-row gap-2 items-start">
			<div className="flex-grow">
				<div className="markdown">
					{!chat.text && <>
						<FontAwesomeIcon icon={faSpinner} spin />
					</>}
					{parsedText.thinking && <>
						<Button
							theme="custom"
							isSmall
							onClick={() => setShowThinking(!showThinking)}
							className={`mb-2 ${parsedText.isThinking ? 'animate-pulse' : ''}`}>
							{showThinking ? 'Hide thinking' : 'Show thinking'}
						</Button>
						{showThinking && <>
							<div className="opacity-50 mb-6">
								<Markdown>
									{parsedText.thinking}
								</Markdown>
							</div>
						</>}
					</>}
					{parsedText.response && <Markdown>{parsedText.response}</Markdown>}
				</div>
			</div>
			<div className="">
				<Button
					theme="custom"
					isOutline
					isSmall
					className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 p-2 hover:text-red-500"
					onClick={() => conversationContext?.actions.chat.delete(chat.id)}>
					<FontAwesomeIcon icon={faTrash} />
				</Button>
			</div>
		</div>
	</div>
}

export default ChatMessage
