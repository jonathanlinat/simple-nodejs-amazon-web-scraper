/**
 * MIT License
 *
 * Copyright (c) 2018-2023 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const constants = require('./constants')
const helpers = require('./helpers')

/**
   * Simple Amazon Web Scraper
   * Author: Jonathan Linat <jonathan.linat@gmail.com>
   * Date: 01/09/2021
   * Last update: 19/09/2023
  */

// Program runs automatically
;(async () => {
  // Hash the key used by the caching layer
  const cacheKey = helpers.createMD5Hash(constants.baseURL + constants.searchKeywords)

  // Get the cached response
  const cachedResults = helpers.cache.get(cacheKey)

  // Return cached results if they still exist
  if (cachedResults) {
    console.log('Returning cached results', cachedResults)

    return cachedResults
  }

  // Raise a new browser instance (Asynchronously)
  const browserInstance = await puppeteer.launch(constants.launchOptions)

  // Open a new tab (Asynchronously)
  const browserPage = await browserInstance.newPage()

  // Go to Amazon.com website (Asynchronously)
  await browserPage.goto(constants.baseURL)

  // Define the imput selector
  const inputSelector = '#twotabsearchtextbox'

  // Wait for the input element
  await browserPage.waitForSelector(inputSelector);

  // Locate the main search field and assigns the value "nvidia rtx 1080 super" (asynchronously)
  await browserPage.$eval(inputSelector, (el, value) => el.value = value, constants.searchKeywords)

  // Click on the associated button to the field to start the search (asynchronously)
  await browserPage.click('#nav-search-submit-button')

  // Wait for the browser to finish loading the new content (Asynchronous)
  await browserPage.waitForNavigation()

  // Click on the link that refers to the category "Computer Graphic Cards" (Asynchronously)
  await browserPage.click('li[id="n/284822"] a')

  // Wait again for the browser to finish loading the new content (Asynchronously)
  await browserPage.waitForNavigation()

  // Take a screenshot of the results page (Asynchronously)
  await browserPage.screenshot({ path: `screenshots/${Date.now()}.png`, fullPage: true })

  // Create an empty collection to store the following results
  const results = []

  try {
    // Save in memory the HTML code of the results page (Asynchronously)
    const pageContent = await browserPage.content()

    // Load content markup in memory
    const loadedContent = cheerio.load(pageContent)

    // Create an array with each of the available results
    const availableResults = loadedContent('[data-component-type="s-search-result"]')

    // Iterate over the previously defined array
    for (const availableResult of availableResults) {
      // Load product markup in memory
      const loadedProduct = cheerio.load(availableResult)

      // Extract the relevant pieces of data from the saved in memory HTML code
      const productTitle = helpers.parsedProductTitle(loadedProduct('h2.a-size-mini'))
      const productUrl = constants.baseURL + helpers.parsedProductURL(loadedProduct('h2.a-size-mini a').attr('href'))
      const productPrice = helpers.parsedProductPrice(loadedProduct('span.a-price[data-a-size] span.a-offscreen').first())

      // Include the extracted data in an object of its own within the array only if the product has a price
      if (productPrice) {
        results.push({
          title: productTitle,
          url: productUrl,
          price: productPrice
        })
      }

      // Sort the products by price (low to high)
      helpers.sortBy('price', results)
    }
  } catch (error) {
    // Just in case of error
    console.error(error)
  }

  // We're done. So, close the browser instance (Asynchronously)
  await browserInstance.close()

  // Cache the results
  helpers.cache.set(cacheKey, results)

  // Display the array of results with the extracted data collection the the console
  console.log('Returning initial results', results)

  // Return the array of results with the extracted data collection
  return results
})()
