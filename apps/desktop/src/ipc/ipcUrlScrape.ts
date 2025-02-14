import { ipcMain } from "electron"
import axios from 'axios'
import * as cheerio from 'cheerio'

export const registerIpcUrlScrape = () => {
	ipcMain.handle('url-scrape', async (_, url: string) => {
		try {
			const response = await axios.get(url)
			const $ = cheerio.load(response.data)

			// Remove unwanted elements
			$('script, style, header, footer, nav, iframe, [role="complementary"]').remove()

			// Add spaces between block elements
			$('div, p, h1, h2, h3, h4, h5, h6, li').after('\n')
			$('br').replaceWith('\n')

			// Get text content and clean it up
			const text = $('body').text()
				.replace(/[\t\f\r]+/g, ' ') // Replace tabs and other whitespace with space
				.replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with max two
				.replace(/[ ]{2,}/g, ' ') // Replace multiple spaces with single space
				.split('\n') // Split into lines
				.map(line => line.trim()) // Trim each line
				.filter(line => line) // Remove empty lines
				.join('\n') // Join back with newlines
				.trim() // Final trim

			return text
		} catch (error) {
			if (error instanceof Error) {
				return `Error scraping URL: ${error.message}`
			}
			return 'An unknown error occurred while scraping the URL'
		}
	})
}
