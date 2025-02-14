import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	title: 'JUICEBOX AI',
	tagline: 'AI freedom is here.',
	favicon: 'img/favicon/favicon.ico',



	// Set the production url of your site here
	url: 'https://desduvauchelle.github.io',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/ai-juicing-juicebox/docs',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'desduvauchelle', // Usually your GitHub org/user name.
	projectName: 'JUICEBOX', // Usually your repo name.

	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
				},
				blog: {
					showReadingTime: true,
					feedOptions: {
						type: ['rss', 'atom'],
						xslt: true,
					},
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
					// Useful options to enforce blogging best practices
					onInlineTags: 'warn',
					onInlineAuthors: 'warn',
					onUntruncatedBlogPosts: 'warn',
				},
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		// Replace with your project's social card
		image: 'img/docusaurus-social-card.jpg',
		navbar: {
			title: 'JUICEBOX AI docs',
			logo: {
				alt: 'AI Juicing docs',
				src: 'img/logo.png',
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'tutorialSidebar',
					position: 'left',
					label: 'Docs',
					to: '/docs',
				},
				{ to: '/blog', label: 'Blog', position: 'left' },
				{
					href: 'https://github.com/desduvauchelle/ai-juicing-juicebox',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Docs',
							to: '/docs',
						},
					],
				},
				// {
				// 	title: 'Community',
				// 	items: [
				// 		{
				// 			label: 'Stack Overflow',
				// 			href: 'https://stackoverflow.com/questions/tagged/docusaurus',
				// 		},
				// 		{
				// 			label: 'Discord',
				// 			href: 'https://discordapp.com/invite/docusaurus',
				// 		},
				// 		{
				// 			label: 'X',
				// 			href: 'https://x.com/docusaurus',
				// 		},
				// 	],
				// },
				// {
				// 	title: 'More',
				// 	items: [
				// 		{
				// 			label: 'Blog',
				// 			to: '/blog',
				// 		},
				// 		{
				// 			label: 'GitHub',
				// 			href: 'https://github.com/facebook/docusaurus',
				// 		},
				// 	],
				// },
			],
			copyright: `Copyright © ${new Date().getFullYear()} JUICEBOX AI by AI Juicing, Inc. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
}

export default config
