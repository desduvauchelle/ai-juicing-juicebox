import * as Diff from 'diff'

type DiffViewProps = {
	oldText: string
	newText: string
}

const DiffView: React.FC<DiffViewProps> = ({ oldText, newText }) => {
	// Use Intl.Segmenter for better word detection, including non-English text
	// Diff.diffWords
	const diff = Diff.diffSentences(oldText, newText, {
		ignoreCase: false
	})

	return (
		<div className="font-mono whitespace-pre-wrap">
			{diff.map((part, i) => {
				const className = part.added
					? 'bg-green-100 text-green-900'
					: part.removed
						? 'bg-red-100 text-red-900 line-through'
						: 'text-base-content'

				return (
					<span
						key={i}
						className={className}
						title={part.added ? 'Added' : part.removed ? 'Removed' : undefined}>
						{part.value}
					</span>
				)
			})}
		</div>
	)
}

export default DiffView
