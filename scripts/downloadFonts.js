const FormData = require('form-data')
const AdmZip = require('adm-zip')
const del = require('del')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')
const fontBlast = require('font-blast')

const ASSET_PATH = path.resolve(__dirname, '..', 'src', 'assets')

const TMP_PATH = path.resolve(ASSET_PATH, 'tmp')
const DOWNLOAD_ZIP_PATH = path.resolve(TMP_PATH, 'downloaded.zip')
const TMP_SVG_FONT_PATH = path.resolve(TMP_PATH, 'icons')
const SVG_ICON_PATH = path.resolve(ASSET_PATH, 'icons')

const instance = axios.default.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})

function retrieveSession() {
  const data = new FormData()
  data.append('config', fs.createReadStream(path.resolve(ASSET_PATH, 'config.json')))

  return instance({
    method: 'POST',
    url: 'https://fontello.com/',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  }).then((res) => {
    return res.data
  })
}

function createTmpPath() {
  return new Promise((resolve, reject) => {
    fs.mkdir(TMP_PATH, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
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
  const downloadedPath = path.resolve(TMP_PATH, 'downloaded')
  zip.extractAllTo(downloadedPath, true)
  const [fontFolder] = fs.readdirSync(downloadedPath)
  return path.resolve(downloadedPath, fontFolder)
}

function moveSvgs() {
  return new Promise((resolve, reject) => {
    fs.rename(path.resolve(TMP_SVG_FONT_PATH, 'svg'), SVG_ICON_PATH, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

del([TMP_PATH, SVG_ICON_PATH])
  .then(createTmpPath)
  .then(() => {
    return retrieveSession()
  })
  .then((sessionId) => {
    console.log('session retrieved: ' + sessionId)
    return downloadFont(sessionId)
  })
  .then(extractDownloadedZip)
  .then((fontFolder) => {
    console.log('new font downloaded!!!')
    return fontBlast(path.resolve(fontFolder, 'font', 'react-painting-icon.svg'), TMP_SVG_FONT_PATH)
  })
  .then(moveSvgs)
  .then(() => {
    return del([TMP_PATH])
  })
  .then(() => {
    console.log('svg icons generated!!!')
  })
