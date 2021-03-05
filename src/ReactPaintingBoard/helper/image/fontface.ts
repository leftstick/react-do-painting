import { asArray } from './util'
import { inlineAll, shouldProcess } from './inliner'

export function resolveAll() {
  return readAll()
    .then((webFonts) => {
      return Promise.all(
        webFonts.map(function (webFont) {
          return webFont.resolve()
        })
      )
    })
    .then(function (cssStrings) {
      return cssStrings.join('\n')
    })
}

export function readAll() {
  return Promise.resolve(asArray(document.styleSheets))
    .then(getCssRules)
    .then(selectWebFontRules)
    .then((rules) => {
      return (rules as CSSFontFaceRule[]).map(newWebFont)
    })

  function selectWebFontRules(cssRules: CSSRule[]) {
    return cssRules
      .filter((rule) => {
        return rule.type === CSSRule.FONT_FACE_RULE
      })
      .filter((rule) => {
        return shouldProcess((rule as CSSFontFaceRule).style.getPropertyValue('src'))
      })
  }

  function getCssRules(styleSheets: CSSStyleSheet[]): CSSRule[] {
    const cssRules: CSSRule[] = []
    styleSheets.forEach((sheet) => {
      try {
        asArray(sheet.cssRules || []).forEach((rule) => {
          cssRules.push(rule)
        })
      } catch (e) {
        console.log('Error while reading CSS rules from ' + sheet.href, e.toString())
      }
    })
    return cssRules
  }

  function newWebFont(webFontRule: CSSFontFaceRule) {
    return {
      resolve: function resolve() {
        var baseUrl = (webFontRule.parentStyleSheet || {}).href
        return inlineAll(webFontRule.cssText, baseUrl)
      },
      src: function () {
        return webFontRule.style.getPropertyValue('src')
      },
    }
  }
}
