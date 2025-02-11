import ChatViewBasic from './ChatViews/ChatViewBasic'
import { useConversation } from "../../context/ConversationContext"
import { useEffect, useRef, useState } from "react"
import Button from "../../components/Button"
import ChatViewCoAuthor from './ChatViews/ChatViewCoAuthor'
import { ModalPickAiService } from '../../ai-service/ModalPickAiService'
import ChatViewRepeater from './ChatViews/ChatViewRepeater'


const ChatViewWrapper: React.FC<{
	conversationId: string
}> = ({
	conversationId
}) => {
		const conversationContext = useConversation()
		const conversation = conversationContext?.conversation
		const isInitiated = useRef<number | undefined>(undefined)
		const [showAiModal, setShowAiModal] = useState(false)

		useEffect(() => {
			if (!conversationId) return
			if (conversationContext?.isLoading) return
			if (isInitiated.current === parseInt(conversationId)) return
			conversationContext?.actions.getByConversationId(parseInt(conversationId))
			isInitiated.current = parseInt(conversationId)
		}, [conversationId, conversationContext?.actions, conversationContext?.isLoading])

		// Check the ping of the config on change of the selectedConfig and every 10 seconds
		useEffect(() => {
			if (!conversationContext?.selectedConfig) return
			if (conversationContext?.selectedConfig?.service !== 'Ollama') return
			// conversationContext?.configChecker.actions.checkStatusWithPing()
			// const interval = setInterval(() => {
			// 	conversationContext?.configChecker.actions.checkStatusWithPing()
			// }, 10000)
			// return () => clearInterval(interval)
		}, [conversationContext?.selectedConfig, conversationContext?.configChecker])

		if (conversationContext?.isLoading || conversationContext?.isLoading === undefined) {
			return <>
				Loading...
			</>
		}

		if (!conversation) {
			return <>
				Conversation not found
			</>
		}

		return <>
			<ModalPickAiService
				isOpen={showAiModal}
				onSelect={(service, modelName) => {
					conversationContext?.actions.update({
						aiServiceId: service.id,
						modelName: modelName || undefined
					})
					setShowAiModal(false)
				}}
				onCancel={() => setShowAiModal(false)}
			/>

			<div className="absolute top-0 right-3 w-full flex flex-row gap-2 items-center ">
				<div className="flex-grow"></div>
				<Button theme="ghost"
					onClick={() => setShowAiModal(true)}
					className="rounded-tr-3xl rounded-b-none rounded-l-none flex flex-row gap-3 items-center">
					{conversationContext?.selectedConfig?.service === 'Ollama' && <>
						{conversationContext?.configChecker.isRunning && <>
							<div className="w-4 h-4 rounded-full bg-green-500"></div>
						</>}
						{!conversationContext?.configChecker.isRunning && <>
							<div className="w-4 h-4 rounded-full bg-red-500"></div>
						</>}
					</>}

					<span>
						{conversationContext.selectedConfig?.name || "No config"}
					</span>
					{conversationContext.conversation?.modelName && <span>
						{conversationContext.conversation?.modelName}
					</span>}
				</Button>
			</div>

			{conversation.type === "chat" && <>
				<ChatViewBasic />
			</>}
			{conversation.type === "co-authoring" && <>
				<ChatViewCoAuthor />
			</>}

			{conversation.type === "repeater" && <>
				<ChatViewRepeater />
			</>}

		</>

		return <>
			VIEW NOT FOUND
		</>
	}

export default ChatViewWrapper
