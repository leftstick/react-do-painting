import { getAndEncode, isDataUrl, dataAsUrl, mimeType, asArray } from './util'
import { inlineAll as inlinerInlineAll } from './inliner'
// return {
//   inlineAll: inlineAll,
//   impl: {
//     newImage: newImage,
//   },
// }

export function newImage(element: HTMLImageElement) {
  return {
    inline: (get?: (str: string) => string) => {
      if (isDataUrl(element.src)) {
        return Promise.resolve()
      }

      return Promise.resolve(element.src)
        .then(get || getAndEncode)
        .then((data) => {
          return dataAsUrl(data, mimeType(element.src))
        })
        .then((dataUrl) => {
          return new Promise(function (resolve, reject) {
            element.onload = resolve
            element.onerror = reject
            element.src = dataUrl
          })
        })
    },
  }
}

export function inlineAll(node: any): any {
  if (!(node instanceof Element)) {
    return Promise.resolve(node)
  }

  function inlineBackground(node: HTMLElement) {
    const background = node.style.getPropertyValue('background')

    if (!background) {
      return Promise.resolve(node)
    }

    return inlinerInlineAll(background, undefined)
      .then((inlined) => {
        node.style.setProperty('background', inlined, node.style.getPropertyPriority('background'))
      })
      .then(() => {
        return node
      })
  }

  return inlineBackground(node as HTMLElement).then(function () {
    if (node instanceof HTMLImageElement) {
      return newImage(node).inline()
    }

    return Promise.all(
      asArray(node.childNodes).map(function (child) {
        return inlineAll(child)
      })
    )
  })
}
