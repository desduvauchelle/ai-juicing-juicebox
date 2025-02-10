import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
	title: string
	Svg: React.ComponentType<React.ComponentProps<'svg'>>
	description: ReactNode
}

const FeatureList: FeatureItem[] = [
	{
		title: 'Use any AI',
		Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
		description: (
			<>
				We're AI agnostic. Use any AI you want with JUICEBOX AI.
			</>
		),
	},
	{
		title: 'Best experiences',
		Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
		description: (
			<>
				We've recreated the experiences you already love like chat, and added a bunch more to fill some annoying holes.
			</>
		),
	},
	{
		title: 'Powered by local AI',
		Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
		description: (
			<>
				We think local AI is the future. That's AI that runs on your device, not in the cloud.
				It's faster, more private, and more reliable.
			</>
		),
	},
]

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	)
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	)
}
