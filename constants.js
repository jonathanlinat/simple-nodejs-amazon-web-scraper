// Define the base URL of the scraper
const baseURL = 'https://www.amazon.com'

// Define the launch options of puppeteer
const launchOptions = { defaultViewport: null }

// Define the keyword of the search
const searchKeywords = 'nvidia rtx 4080'

module.exports = { baseURL, launchOptions, searchKeywords }
