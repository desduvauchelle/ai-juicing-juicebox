import { faDollar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IModel } from "../../types/IAIService"

interface AIModelPriceProps {
	model: Omit<IModel, "service">
	modelList: IModel[]
}

const AIModelPrice = ({ model, modelList }: AIModelPriceProps) => {
	// Use log scale to handle outliers better
	const getLogScale = (value: number) => Math.log10(1 + value)

	// Get maximum token output cost from all models using log scale
	const maxLogCost = Math.max(...modelList.map(m => getLogScale(m.costs?.tokensOut || 0)))
	const currentLogCost = getLogScale(model.costs?.tokensOut || 0)

	// Calculate percentage for position and color
	const percentage = maxLogCost ? (currentLogCost / maxLogCost) : 0

	// Enhanced color gradient with more steps
	const getColor = (pct: number) => {
		if (pct === 0) return '#22c55e'  // green-500
		if (pct < 0.15) return '#4ade80' // green-400
		if (pct < 0.30) return '#84cc16' // lime-500
		if (pct < 0.45) return '#eab308' // yellow-500
		if (pct < 0.60) return '#f59e0b' // amber-500
		if (pct < 0.75) return '#f97316' // orange-500
		if (pct < 0.90) return '#dc2626' // red-600
		return '#b91c1c'                 // red-700
	}

	if (!model.costs?.tokensOut || 0) {
		return <span className="inline-flex items-center gap-1 tooltip tooltip-left"
			data-tip={`Free`}>
			<FontAwesomeIcon icon={faDollar} className="text-base opacity-50" />

		</span>
	}

	return (
		<span className="inline-flex items-center gap-1 tooltip tooltip-left"
			data-tip={`In: $${((model.costs?.tokensIn || 0)).toFixed(2)} - Out: $${((model.costs?.tokensOut || 0)).toFixed(2)}`}>
			<FontAwesomeIcon icon={faDollar} style={{ color: getColor(percentage) }} />

		</span>
	)
}

export default AIModelPrice
