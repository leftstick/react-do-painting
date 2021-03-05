function mimes() {
  /*
   * Only WOFF and EOT mime types for fonts are 'real'
   * see http://www.iana.org/assignments/media-types/media-types.xhtml
   */
  const WOFF = 'application/font-woff'
  const JPEG = 'image/jpeg'

  return {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
  }
}

function toBlob(canvas: HTMLCanvasElement) {
  return new Promise(function (resolve) {
    var binaryString = window.atob(canvas.toDataURL().split(',')[1])
    var length = binaryString.length
    var binaryArray = new Uint8Array(length)

    for (var i = 0; i < length; i++) binaryArray[i] = binaryString.charCodeAt(i)

    resolve(
      new Blob([binaryArray], {
        type: 'image/png',
      })
    )
  })
}

function px(node: Element, styleProperty: string) {
  var value = window.getComputedStyle(node).getPropertyValue(styleProperty)
  return parseFloat(value.replace('px', ''))
}

export function escape(str: string) {
  return str.replace(/([.*+?^${}()|[\]/\\])/g, '\\$1')
}

export function parseExtension(url: string): string {
  const match = /\.([^./]*?)$/g.exec(url)
  if (match) {
    return match[1]
  }
  return ''
}

export function mimeType(url: string) {
  const extension = parseExtension(url).toLowerCase()
  const mimeMap = mimes()
  if (Object.keys(mimeMap).includes(extension)) {
    return mimeMap[extension as keyof typeof mimeMap]
  }
  return ''
}

export function dataAsUrl(content: string, type: string) {
  return 'data:' + type + ';base64,' + content
}

export function isDataUrl(url: string) {
  return url.search(/^(data:)/) !== -1
}

export function canvasToBlob(canvas: HTMLCanvasElement) {
  if (canvas.toBlob)
    return new Promise(function (resolve) {
      canvas.toBlob(resolve)
    })

  return toBlob(canvas)
}

export function resolveUrl(url: string, baseUrl: string) {
  var doc = document.implementation.createHTMLDocument()
  var base = doc.createElement('base')
  doc.head.appendChild(base)
  var a = doc.createElement('a')
  doc.body.appendChild(a)
  base.href = baseUrl
  a.href = url
  return a.href
}

export function getAndEncode(url: string): Promise<string> {
  const TIMEOUT = 30000

  return new Promise<string>(function (resolve) {
    var request = new XMLHttpRequest()

    request.onreadystatechange = done
    request.ontimeout = timeout
    request.responseType = 'blob'
    request.timeout = TIMEOUT
    request.open('GET', url, true)
    request.send()

    function done() {
      if (request.readyState !== 4) return

      if (request.status !== 200) {
        fail('cannot fetch resource: ' + url + ', status: ' + request.status)

        return
      }

      var encoder = new FileReader()
      encoder.onloadend = function () {
        var content = (encoder.result as string).split(/,/)[1]
        resolve(content)
      }
      encoder.readAsDataURL(request.response)
    }

    function timeout() {
      fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url)
    }

    function fail(message: string) {
      console.error(message)
      resolve('')
    }
  })
}

export function asArray<T>(arrayLike: ArrayLike<T>) {
  const array: T[] = []
  const length = arrayLike.length
  for (var i = 0; i < length; i++) {
    array.push(arrayLike[i])
  }
  return array
}

export function escapeXhtml(str: string) {
  return str.replace(/#/g, '%23').replace(/\n/g, '%0A')
}

export function makeImage(uri: any): Promise<HTMLImageElement> {
  return new Promise(function (resolve, reject) {
    const image = new Image()
    image.onload = function () {
      resolve(image)
    }
    image.onerror = reject
    image.src = uri
  })
}

export function width(node: Element) {
  const leftBorder = px(node, 'border-left-width')
  const rightBorder = px(node, 'border-right-width')
  return node.scrollWidth + leftBorder + rightBorder
}

export function height(node: Element) {
  const topBorder = px(node, 'border-top-width')
  const bottomBorder = px(node, 'border-bottom-width')
  return node.scrollHeight + topBorder + bottomBorder
}

export function delay<T>(ms: number) {
  return (arg: T) => {
    return new Promise<T>(function (resolve) {
      setTimeout(function () {
        resolve(arg)
      }, ms)
    })
  }
}
