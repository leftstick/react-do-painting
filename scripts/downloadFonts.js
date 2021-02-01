const FormData = require('form-data')
const AdmZip = require('adm-zip')
const del = require('del')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')

const ASSET_PATH = path.resolve(__dirname, '..', 'src', 'assets')

const DOWNLOAD_ZIP_PATH = path.resolve(ASSET_PATH, 'downloaded.zip')

const instance = axios.default.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

function retrieveSession() {
  const form = new FormData()
  form.append('config', fs.createReadStream(path.resolve(ASSET_PATH, 'config.json')))

  return instance
    .post('https://fontello.com/', form, {
      headers: form.getHeaders(),
    })
    .then((res) => {
      return res.data
    })
}

async function downloadFont(sessionId) {
  const writer = fs.createWriteStream(DOWNLOAD_ZIP_PATH)
  const response = await instance({
    url: `https://fontello.com/${sessionId}/get`,
    method: 'GET',
    responseType: 'stream',
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

function extractDownloadedZip() {
  const zip = new AdmZip(DOWNLOAD_ZIP_PATH)
  zip.extractAllTo(path.resolve(ASSET_PATH, 'downloaded'), true)
  const [fontFolder] = fs.readdirSync(path.resolve(ASSET_PATH, 'downloaded'))
  return path.resolve(ASSET_PATH, 'downloaded', fontFolder)
}

function moveFonts(fontFolder) {
  const moveCss = new Promise((resolve, reject) => {
    fs.rename(path.resolve(fontFolder, 'css'), path.resolve(ASSET_PATH, 'css'), function (err) {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
  const moveFont = new Promise((resolve, reject) => {
    fs.rename(path.resolve(fontFolder, 'font'), path.resolve(ASSET_PATH, 'font'), function (err) {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

  return Promise.all([moveCss, moveFont])
}

del([
  path.resolve(ASSET_PATH, 'css'),
  path.resolve(ASSET_PATH, 'font'),
  path.resolve(ASSET_PATH, 'downloaded'),
  path.resolve(ASSET_PATH, 'downloaded.zip'),
])
  .then(() => {
    return retrieveSession()
  })
  .then((sessionId) => {
    return downloadFont(sessionId)
  })
  .then(extractDownloadedZip)
  .then(moveFonts)
  .then(() => {
    return del([path.resolve(ASSET_PATH, 'downloaded'), path.resolve(ASSET_PATH, 'downloaded.zip')])
  })
  .then(() => {
    console.log('new font downloaded!!!')
  })
