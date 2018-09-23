const https = require(`https`)
const Stream = require(`stream`).Transform
const fs = require(`fs`)

const urlArr = require(`./urls`)

const getPics = urlArr => {
  urlArr.forEach((url, i) => {
    https.request(url, response => {
      const data = new Stream()
      response.on(`data`, chunk => {
        data.push(chunk)
      })
      response.on(`end`, () => {
        fs.writeFileSync(`downloaded_pictures/image${i}.png`, data.read())
      })
    }).end()
  })
}

getPics(urlArr)
