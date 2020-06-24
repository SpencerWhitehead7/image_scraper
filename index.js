require('dotenv').config();

const fs = require(`fs`)

const puppeteer = require('puppeteer');
const download = require('download');

(async () => {
  let browser
  try {
    const { fbUsername, fbPassword } = process.env
    const accountNameToScrape = process.argv[2]
    const picturesToSave = process.argv[3]

    browser = await puppeteer.launch({
      // headless: false,
      // defaultViewport: null,
    })
    const [page] = await browser.pages()
    await page.goto('https://www.instagram.com')

    await page.waitForXPath("//button[contains(., 'Log in with Facebook')]")
    const [loginWithFbButton] = await page.$x("//button[contains(., 'Log in with Facebook')]")
    loginWithFbButton.click()

    await page.waitForSelector('#email')
    await page.type('#email', fbUsername)
    await page.waitForSelector('#pass')
    await page.type('#pass', fbPassword)
    await page.waitForXPath("//button[contains(., 'Log In')]")
    const [loginButton] = await page.$x("//button[contains(., 'Log In')]")
    loginButton.click()
    await page.waitForNavigation({ waitUntil: "networkidle0"})
    await page.goto(`https://www.instagram.com/${accountNameToScrape}`)

    const urlsToCheck = []
    const postTexts = []
    const postImageUrls = new Set()
    const downloadingImages = []
    const [firstPost] = await page.$$('div.v1Nh3')
    firstPost.click()

    while (true) {
      await page.waitForNavigation({ waitUntil: "networkidle0" })

      try {
        // why not h2._6lAjh (the actual user name element I'm trying to select)?
        // it doesn't render immediately after page.waitForNavigation finishes
        // if the post has no caption, it never renders at all, causing a timeout and error
        // however, if article.M9sTE is rendered, the h2 will be rendered too (assuming it renders at all)
        // you could also waitForSelector on the h2 itself, but that will either cause a long delay on posts with no caption
        // or the risk skipping a post because I set the timeout too aggressively
        await page.waitForSelector('article.M9sTE')
        await page.waitFor(5000 + Math.random() * 3000)
        const [igName] = await page.$$('h2._6lAjh')
        if (igName) {
          const post = await page.evaluateHandle(el => el.nextElementSibling, igName)
          if (post) {
            const postText = await (await post.getProperty('innerText')).jsonValue()
            postTexts.push(postText)
          }
        }
      } catch (_) {
        urlsToCheck.push(page.url())
      }

      if (picturesToSave && downloadingImages.length < picturesToSave) {
        const newImageSrcs = (await page
          .$$eval('img.FFVAD', images => images.map(image => image.getAttribute("src"))))
          .filter(Boolean) // you get nulls sometimes for some reason
          .filter(src => !postImageUrls.has(src))
        newImageSrcs.forEach(src => { postImageUrls.add(src) })
        for (src of newImageSrcs) {
          if (downloadingImages.length < picturesToSave) downloadingImages.push(download(src, 'postImages'))
        }
      }

      const [nextArrow] = await page.$$('.coreSpriteRightPaginationArrow')
      if (nextArrow) {
        nextArrow.click()
      } else {
        break
      }
    }

    fs.writeFileSync('postTexts.txt', postTexts.join('\n\n'))
    fs.writeFileSync('urlsToRetry.js', urlsToCheck.length
      ? `module.exports = [\n'${urlsToCheck.join("',\n'")}'\n]\n`
      : 'module.exports = []\n'
    )
    await Promise.all(downloadingImages)
  } catch (err) {
    console.log(err)
  } finally {
    await browser.close()
  }
})()
