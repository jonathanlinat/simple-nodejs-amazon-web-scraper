# Simple Node.js Amazon Web Scraper

This is a really simplistic Node.js example that teach you how to scrape data from Amazon.

_Original unlisted Globant Webinar: https://www.youtube.com/watch?v=Hqn8JPEOqb8_

## Details

This project uses Cheerio and Puppeteer libraries.

### Prerequisites

- Node 18
- pnpm 7

## First steps

Clone locally the repository.

```
cd <path/to/your/desired/folder/>
git clone git@github.com:jonathanlinat/simple-nodejs-amazon-web-scraper.git
```

Install the dependencies.

```
cd simple-nodejs-amazon-web-scraper/
pnpm install
```

### Specific commands

Run the script.

```bash
pnpm run scrape
```

Scraped data will be returned as an array of objects and displayed as Terminal message.
