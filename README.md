# Image Scraper

Small node script for scraping images from an array of urls that point to images. Originally done as part of the Danaher Markov Quote website, when I was trying to gather images to use for the fake Instagram tiles. Programatically scraping Instagram probably requires a full headless browser setup, but you can get (a chunk of) the little preview tiles fairly easily.

## Usage

Gather a set of urls corresponding to the images you want to scrape, paste them into the array in "urls.js" as a bunch of strings, then run "node index.js"

## Future plans

Possibly automate a way to gather arrays of image urls within node, instead of having to gather them in dev tools or some other way and paste them in.