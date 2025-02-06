import ChatViewBasic from './ChatViews/ChatViewBasic'
import { useConversation } from "../../context/ConversationContext"
import { useEffect, useRef, useState } from "react"
import { faRobot, faSquareCaretDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../../components/Button"
import Select from "../../components/Select"
import ChatViewCanvas from './ChatViews/ChatViewCanvas'
import { InlineAlert } from '../../components/InlineAlert'
import { formatDistanceToNow } from 'date-fns'


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
					aria-label="Toggle server status"
					className="absolute top-0 left-0 w-full h-full bg-gray-800/10 backdrop-blur-xs"></button>
				<div className="absolute top-0 left-0 w-full p-4 pt-16 bg-base-200">
					<div className="flex flex-col md:flex-row gap-4">


						<div className="flex-1">
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

						<div className="flex-1">
							{conversationContext?.configChecker.isRunning && <>
								<InlineAlert type="success">
									Server is reachable.
								</InlineAlert>

							</>}
							{!conversationContext?.configChecker.isRunning && <>
								<InlineAlert type="error">
									<p>Server is not reachable. It might be idle as it goes to sleep after a couple of minutes.</p>
									<div className="flex flex-row gap-2 items-center">
										<Button
											isLoading={conversationContext?.configChecker.isCheckingRunning}
											onClick={() => conversationContext?.configChecker.actions.checkStatusWithPing()}
											theme="danger">
											Check again
										</Button>
										<span className='text-sm italic'>
											Last checked: {formatDistanceToNow(new Date(conversationContext?.configChecker.lastRunningCheck || 0), { addSuffix: false })}
										</span>
									</div>
								</InlineAlert>
							</>}
						</div>
					</div>


				</div>
			</>}
			<div className="absolute top-0 right-3 w-full flex flex-row gap-2 items-center ">
				{!isMenuOpen && <Button aria-label="Hide menu" onClick={toggleMenu} theme="ghost">
					<FontAwesomeIcon icon={faSquareCaretDown} className='rotate-90' />
				</Button>}
				<div className="flex-grow"></div>
				<Button theme="ghost"
					onClick={() => setShowConfigStatusDetails(!showConfigStatusDetails)}
					className=" rounded-tr-3xl rounded-b-none rounded-l-none flex flex-row gap-3 items-center">
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
