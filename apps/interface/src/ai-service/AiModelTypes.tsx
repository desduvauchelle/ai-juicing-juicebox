import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faBrain,
	faCode,
	faWrench,
	faImage,
	faDatabase,
	faDollar,
	IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { IModel } from '../../types/IAIService'

const SHOW_DISABLED_ICONS = false // Toggle this to show/hide disabled icons
const BASE_ICON_CLASSES = ''
const DISABLED_CLASSES = 'opacity-30'

interface AiModelTypesProps {
	model: Omit<IModel, 'service'>
	modelList: IModel[]
}

const AiModelTypes: React.FC<AiModelTypesProps> = ({ model, modelList }) => {
	// Pricing logic
	const getLogScale = (value: number) => Math.log10(1 + value)
	const maxLogCost = Math.max(...modelList.map(m => getLogScale(m.costs?.tokensOut || 0)))
	const currentLogCost = getLogScale(model.costs?.tokensOut || 0)
	const percentage = maxLogCost ? (currentLogCost / maxLogCost) : 0

	const getColor = (pct: number) => {
		if (pct === 0) return '#22c55e'
		if (pct < 0.15) return '#4ade80'
		if (pct < 0.30) return '#84cc16'
		if (pct < 0.45) return '#eab308'
		if (pct < 0.60) return '#f59e0b'
		if (pct < 0.75) return '#f97316'
		if (pct < 0.90) return '#dc2626'
		return '#b91c1c'
	}

	const getPriceTooltip = (model: Omit<IModel, 'service'>) => {
		if (!model.costs) return 'Free'
		if (model.costs.perImage) return `Per image: $${model.costs.perImage.toFixed(2)}`
		return `In: $${(model.costs.tokensIn || 0).toFixed(2)} - Out: $${(model.costs.tokensOut || 0).toFixed(2)}`
	}

	const renderIcon = (
		icon: IconDefinition,
		isEnabled: boolean,
		tooltip: string,
		style?: React.CSSProperties
	) => {
		if (!SHOW_DISABLED_ICONS && !isEnabled) return null

		return <span className='tooltip tooltip-left' data-tip={tooltip}>
			<FontAwesomeIcon
				icon={icon}
				className={`${BASE_ICON_CLASSES} ${!isEnabled ? DISABLED_CLASSES : ''}`}
				style={style}
			/>
		</span>
	}


	return <div className="flex gap-2 items-center text-sm">
		{renderIcon(
			faBrain,
			!!model.features?.context,
			model.features?.context ? `Context ${model.features?.context / 1_000}K` : 'No context window specified'
		)}
		{renderIcon(
			faCode,
			!!model.features?.hasJson,
			model.features?.hasJson ? 'Structured Output' : 'No structured output'
		)}
		{renderIcon(
			faWrench,
			!!model.features?.hasToolUse,
			model.features?.hasToolUse ? 'Tool Usage' : 'No tool usage'
		)}
		{renderIcon(
			faImage,
			!!model.features?.forImage,
			model.features?.forImage ? 'Image Generation' : 'No image generation'
		)}
		{renderIcon(
			faDatabase,
			!!model.features?.forEmbedding,
			model.features?.forEmbedding ? 'Embedding' : 'No embedding'
		)}

		{/* Pricing */}
		{renderIcon(
			faDollar,
			true,
			getPriceTooltip(model),
			(model.costs?.tokensOut || model.costs?.perImage) ? { color: getColor(percentage) } : undefined
		)}
	</div>
}

export default AiModelTypes
