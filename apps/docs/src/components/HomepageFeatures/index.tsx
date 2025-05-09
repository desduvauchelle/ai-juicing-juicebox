import type { ReactNode } from 'react'
import clsx from 'clsx'
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
	title: string
	Svg?: React.ComponentType<React.ComponentProps<'svg'>>
	description: ReactNode
}

const FeatureList: FeatureItem[] = [
	{
		title: 'Industry standard Chat',
		// Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
		description: (
			<>
				Our chat interface is designed to compete with the best in the industry, making it easy to adopt, and easy to use.
			</>
		),
	},
	{
		title: 'Use any AI model',
		// Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
		description: (
			<>
				Whatever is the best today, won't be tomorrows. That's why we let you use any AI model you want.
				Change it, update it, or even create your own. No lockin.
			</>
		),
	},
	{
		title: 'Extended experiences',
		// Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
		description: (
			<>
				Chatting is fun, but it's also limited. We are developing new interfaces and functionalities for you to juice every last drop of value out of AI.
			</>
		),
	},
]

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx('col col--4')}>
			{Svg && <div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>}
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
