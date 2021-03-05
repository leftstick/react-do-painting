import { escape, getAndEncode, resolveUrl, isDataUrl, dataAsUrl, mimeType } from './util'

const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g

export function shouldProcess(string: string) {
  return string.search(URL_REGEX) !== -1
}

export function readUrls(string: string) {
  var result = []
  var match
  while ((match = URL_REGEX.exec(string)) !== null) {
    result.push(match[1])
  }
  return result.filter(function (url) {
    return !isDataUrl(url)
  })
}

export function inline(string: string, url: string, baseUrl: string | undefined | null, get?: (str: string) => string) {
  return Promise.resolve(url)
    .then(function (url) {
      return baseUrl ? resolveUrl(url, baseUrl) : url
    })
    .then(get || getAndEncode)
    .then(function (data) {
      return dataAsUrl(data, mimeType(url))
    })
    .then(function (dataUrl) {
      return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3')
    })

  function urlAsRegex(url: string) {
    return new RegExp('(url\\([\'"]?)(' + escape(url) + ')([\'"]?\\))', 'g')
  }
}

export function inlineAll(string: string, baseUrl: string | undefined | null, get?: (str: string) => string) {
  if (nothingToInline()) return Promise.resolve(string)

  return Promise.resolve(string)
    .then(readUrls)
    .then(function (urls) {
      var done = Promise.resolve(string)
      urls.forEach(function (url) {
        done = done.then(function (string) {
          return inline(string, url, baseUrl, get)
        })
      })
      return done
    })

  function nothingToInline() {
    return !shouldProcess(string)
  }
}
