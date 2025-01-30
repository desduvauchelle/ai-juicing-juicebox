import ChatViewBasic from './ChatViews/ChatViewBasic'
import { useConversation } from "../../context/ConversationContext"
import { useEffect, useRef, useState } from "react"
import { faRobot, faSquareCaretDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../../components/Button"
import Select from "../../components/Select"
import ChatViewCanvas from './ChatViews/ChatViewCanvas'


const ChatViewWrapper: React.FC<{
	toggleMenu: () => void,
	isMenuOpen: boolean,
	conversationId: string
}> = ({
	toggleMenu,
	isMenuOpen,
	conversationId
}) => {
		const conversationContext = useConversation()
		const conversation = conversationContext?.conversation
		const isInitiated = useRef<number | undefined>(undefined)
		const [showConfigStatusDetails, setShowConfigStatusDetails] = useState(false)


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
			const interval = setInterval(() => {
				conversationContext?.configChecker.actions.checkStatusWithPing()
			}, 10000)
			return () => clearInterval(interval)
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

			{showConfigStatusDetails && <>
				<button
					onClick={() => setShowConfigStatusDetails(false)}
					aria-label="Toggle server status" className="absolute top-0 left-0 w-full h-full bg-gray-800/10 backdrop-blur-xs"></button>
				<div className="absolute top-0 left-0 w-full p-4 pt-16 bg-base-200">
					{conversationContext?.configChecker.isRunning && <>
						<p className="text-green-500">Server is reachable.</p>
					</>}
					{!conversationContext?.configChecker.isRunning && <>
						<p className="text-red-500">Server is not reachable.</p>
					</>}

					<div className="mt-4">
						<Select
							label='Select LLM Configuration'
							value={conversationContext?.conversation?.llmConfigId?.toString() || ''}
							onChange={(e) => {
								// conversationContext?.actions.selectConfig(parseInt(e.target.value))
								conversationContext?.actions.update({
									llmConfigId: parseInt(e.target.value)
								})
							}}
							options={[
								{
									value: "",
									label: 'Select LLM Configuration',
									disabled: true
								},
								...(conversationContext?.configs || []).map(c => ({
									value: c.id.toString(),
									label: c.name
								}))
							]} />
					</div>
				</div>
			</>}
			<div className="absolute top-0 right-3 w-full flex flex-row gap-2 items-center ">
				{!isMenuOpen && <Button aria-label="Hide menu" onClick={toggleMenu} theme="ghost">
					<FontAwesomeIcon icon={faSquareCaretDown} className='rotate-90' />
				</Button>}
				<div className="flex-grow"></div>
				<Button theme="custom"
					onClick={() => setShowConfigStatusDetails(!showConfigStatusDetails)}
					className="btn text-base-200 font-normal bg-base-100 hover:bg-base-200 rounded-tr-3xl rounded-b-none rounded-l-none flex flex-row gap-3 items-center">
					{conversationContext?.configChecker.isRunning && <>
						<div className="w-4 h-4 rounded-full bg-green-500"></div>
					</>}
					{!conversationContext?.configChecker.isRunning && <>
						<div className=" w-4 h-4 rounded-full bg-red-500"></div>
					</>}
					<span className="relative">
						<FontAwesomeIcon icon={faRobot} />

					</span>
					<span>
						{conversationContext.selectedConfig?.name || "No config"}
					</span>
				</Button>
			</div>


			{conversation.type === "chat" && <>
				<ChatViewBasic />
			</>}
			{conversation.type === "co-authoring" && <>
				<ChatViewCanvas />
			</>}
		</>


		return <>
			VIEW NOT FOUND
		</>
	}

export default ChatViewWrapper
