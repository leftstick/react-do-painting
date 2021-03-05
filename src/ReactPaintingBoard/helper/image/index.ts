import { asArray, makeImage, delay, width, height, escapeXhtml } from './util'
import { inlineAll as imagesInlineAll } from './images'
import { resolveAll } from './fontface'
import { id } from '../object'

function toSvg(node: Element) {
  return Promise.resolve(node)
    .then((node) => {
      return cloneNode(node, true)
    })
    .then(embedFonts)
    .then(inlineImages)
    .then((clone) => {
      return makeSvgDataUri(clone, width(node), height(node))
    })
}

export function downloadAsPng(node: Element, fileName: string) {
  return draw(node).then((canvas) => {
    const link = document.createElement('a')
    link.download = fileName
    link.href = canvas.toDataURL()
    link.click()
  })
}

function draw(domNode: Element) {
  return toSvg(domNode)
    .then(makeImage)
    .then(delay<HTMLImageElement>(100))
    .then((image) => {
      const canvas = newCanvas(domNode)
      ;(canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(image, 0, 0)
      return canvas
    })

  function newCanvas(domNode: Element) {
    var canvas = document.createElement('canvas')
    canvas.width = width(domNode)
    canvas.height = height(domNode)

    return canvas
  }
}

function cloneNode(node: Element | ChildNode, root: boolean) {
  return Promise.resolve(node)
    .then(makeNodeCopy)
    .then((clone) => {
      return cloneChildren(node, clone)
    })
    .then((clone) => {
      return processClone(node, clone)
    })

  function makeNodeCopy(node: Element | Node) {
    if (node instanceof HTMLCanvasElement) {
      return makeImage(node.toDataURL())
    }
    return node.cloneNode(false)
  }

  function cloneChildren(original: Element | Node, clone: Element | Node) {
    const children = original.childNodes
    if (children.length === 0) {
      return Promise.resolve(clone)
    }

    return cloneChildrenInOrder(clone, asArray<ChildNode>(children)).then(() => {
      return clone
    })

    function cloneChildrenInOrder(parent: Node, children: ChildNode[]) {
      let done = Promise.resolve()
      children.forEach((child) => {
        done = done
          .then(() => {
            return cloneNode(child, false)
          })
          .then((childClone) => {
            if (childClone) parent.appendChild(childClone)
          })
      })
      return done
    }
  }

  function processClone(original: Element | Node, clone: Element | Node) {
    if (!(clone instanceof Element)) {
      return clone
    }

    return Promise.resolve()
      .then(cloneStyle)
      .then(clonePseudoElements)
      .then(copyUserInput)
      .then(fixSvg)
      .then(() => {
        return clone
      })

    function cloneStyle() {
      copyStyle(window.getComputedStyle(original as Element), (clone as HTMLElement).style)

      function copyStyle(source: CSSStyleDeclaration, target: CSSStyleDeclaration) {
        if (source.cssText) {
          target.cssText = source.cssText
        } else {
          copyProperties(source, target)
        }

        function copyProperties(source: CSSStyleDeclaration, target: CSSStyleDeclaration) {
          asArray(source).forEach((name) => {
            target.setProperty(name, source.getPropertyValue(name), source.getPropertyPriority(name))
          })
        }
      }
    }

    function clonePseudoElements() {
      ;[':before', ':after'].forEach((element) => {
        clonePseudoElement(element)
      })

      function clonePseudoElement(element: string) {
        const style = window.getComputedStyle(original as Element, element)
        const content = style.getPropertyValue('content')

        if (content === '' || content === 'none') {
          return
        }

        const className = id()

        ;(clone as HTMLElement).className = (clone as HTMLElement).className + ' ' + className

        const styleElement = document.createElement('style')
        styleElement.appendChild(formatPseudoElementStyle(className, element, style))
        clone.appendChild(styleElement)

        function formatPseudoElementStyle(className: string, element: string, style: CSSStyleDeclaration) {
          const selector = '.' + className + ':' + element
          const cssText = style.cssText ? formatCssText(style) : formatCssProperties(style)
          return document.createTextNode(selector + '{' + cssText + '}')

          function formatCssText(style: CSSStyleDeclaration) {
            const content = style.getPropertyValue('content')
            return style.cssText + ' content: ' + content + ';'
          }

          function formatCssProperties(style: CSSStyleDeclaration) {
            return asArray(style).map(formatProperty).join('; ') + ';'

            function formatProperty(name: string) {
              return name + ': ' + style.getPropertyValue(name) + (style.getPropertyPriority(name) ? ' !important' : '')
            }
          }
        }
      }
    }

    function copyUserInput() {
      if (original instanceof HTMLTextAreaElement) {
        ;(clone as HTMLTextAreaElement).innerHTML = original.value
      }
      if (original instanceof HTMLInputElement) {
        ;(clone as HTMLInputElement).setAttribute('value', original.value)
      }
    }

    function fixSvg() {
      if (!(clone instanceof SVGElement)) return
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      if (!(clone instanceof SVGRectElement)) return
      ;['width', 'height'].forEach(function (attribute) {
        var value = clone.getAttribute(attribute)
        if (!value) return

        clone.style.setProperty(attribute, value)
      })
    }
  }
}

function embedFonts(node: Element | Node) {
  return resolveAll().then((cssText) => {
    var styleNode = document.createElement('style')
    node.appendChild(styleNode)
    styleNode.appendChild(document.createTextNode(cssText))
    return node
  })
}

function inlineImages(node: Element | Node) {
  return imagesInlineAll(node).then(function () {
    return node
  })
}

function makeSvgDataUri(node: Element, width: number, height: number) {
  return Promise.resolve(node)
    .then(function (node) {
      node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
      return new XMLSerializer().serializeToString(node)
    })
    .then(escapeXhtml)
    .then((xhtml) => {
      return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>'
    })
    .then((foreignObject) => {
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="' +
        width +
        '" height="' +
        height +
        '">' +
        foreignObject +
        '</svg>'
      )
    })
    .then((svg) => {
      return 'data:image/svg+xml;charset=utf-8,' + svg
    })
}
