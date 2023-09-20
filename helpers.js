const NodeCache = require('node-cache')
const crypto = require('crypto')

// Parse the product properties
const parsedProductTitle = (title = '') => title.text().trim()
const parsedProductURL = (url = '') => url.split('?')[0]
const parsedProductPrice = (price = '') => parseFloat(price.text().trim().replace('$', '').replace(',', ''))

// Sort the results by a specific entry
const sortBy = (entry = '', results = []) => results.sort((a, b) => parseFloat(a[entry]) - parseFloat(b[entry]))

// Init the caching layer
const cache = new NodeCache({ stdTTL: 1300 })

// Create a MD5 hash of a provided data
const createMD5Hash = (data = '') => {
  const hash = crypto.createHash('md5')

  hash.update(data)

  return hash.digest('hex')
}

module.exports = { parsedProductTitle, parsedProductURL, parsedProductPrice, sortBy, cache, createMD5Hash }
