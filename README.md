# Social Media Scraper

A Puppeteer script for scraping the text and photos of Instagram posts, written to gather posts for [Markov Danaher Quotes](https://github.com/SpencerWhitehead7/markov-danaher-quotes). The text of the posts is used to generate the underlying markov chain, and the images are used to populate the site's fake instagram tiles. However, it can scrape any account that's publicly accessible or that your Instagram account is connected to. I suspect it will break/go stale over time as the HTML/class names Instagram uses change, but the overall framework should continue working. I'm not inclined to actively maintain it, but I will fix it if I need something scraped again.

## Usage

Create a .env file with your `fbUsername` and `fbPassword`. Run `node index.js <name of account of scrape> <quantity of images to scrape>`. Uncomment the `headless: false,` `defaultViewport: null,` lines in index to view scraper working. The random delay inside the loop is to keep instagram from choking you off with a 409 because you requested too many resources too quickly. If you're going to be running a big job in the background, you will need to ensure your computer doesn't go to sleep halfway though as well.

## Future plans

All this is speculative because it already does everything I really need, but maybe

- a parameter to let you download all images automatically
- a parameter to limit the number of post texts to scrape
- a way to do more than one account in one run
- a way to log in with an instagram account (currently, you can only log in via facebook) and a parameter to control it
- error handling, parameter validation
- Typescript?
- Linting?
- Support for scraping images from facebook itself
