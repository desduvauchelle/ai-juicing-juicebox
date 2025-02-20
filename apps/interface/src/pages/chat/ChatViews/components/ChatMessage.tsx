import { faChevronDown, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useMemo, useState } from "react"
import Markdown from "react-markdown"
import Button from "../../../../components/Button"
import { useConversation } from "../../../../context/ConversationContext"
import { IConversationChat } from "../../../../../types/IConversation"
import InlineLoader from "../../../../components/InlineLoader"



const ChatMessage: React.FC<{
	chat: IConversationChat,
	maxWidth?: string
}> = ({ chat, maxWidth }) => {
	const [showThinking, setShowThinking] = useState(true)
	const conversationContext = useConversation()
	const [showWebsiteContent, setShowWebsiteContent] = useState(false)


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
		return <div className={`${maxWidth || ""} group px-4 lg:px-0`}>

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
				<div className="max-w-lg px-4 rounded-xl bg-base-200">
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
								<div className="opacity-50 mb-6 max-w-full">
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

	if (chat.role === "assistant" && chat.data?.url) {
		return <div className={`${maxWidth || ""} group px-4 lg:px-1`}>

			<div className="flex flex-row gap-2 items-start">
				<div className="flex-grow">
					<div className="markdown">
						{!chat.data.url.content && <>
							<InlineLoader />
						</>}
						{chat.data.url.content && <div>
							<div className="mockup-browser border-base-100 border">
								<div className="mockup-browser-toolbar">
									<div className="input border-base-100 border">{chat.data.url.url}</div>
								</div>
								<div className="border-base-300 bg-base-200 flex flex-col justify-center border-t px-4 pt-4 pb-0">

									<div className={`w-full rl ${showWebsiteContent ? "max-h-96 overflow-y-auto" : "line-clamp-5"}`}>
										{chat.data.url.content}
									</div>
									<p className="text-center"><Button
										theme="ghost"
										isSmall
										onClick={() => setShowWebsiteContent(!showWebsiteContent)}>
										<FontAwesomeIcon icon={faChevronDown} className={`${showWebsiteContent ? "rotate-180" : ""} mr-2`} />
										{showWebsiteContent ? 'Show less' : 'Show more'}
									</Button></p>
								</div>
							</div>

						</div>}
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


	return <div className={`${maxWidth || ""} group px-4 lg:px-0`}>

		<div className="flex flex-row gap-2 items-start">
			<div className="flex-grow w-full">
				<div className="markdown">
					{!chat.text && <>
						<InlineLoader />
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
