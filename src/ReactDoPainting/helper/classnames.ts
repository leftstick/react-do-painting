import { isString } from './object'

interface IClassMap {
  [classname: string]: boolean | undefined
}

export function classnames(...args: (IClassMap | string | undefined)[]): string {
  return args.reduce<string>((result, key) => {
    if (key === undefined || key === null) {
      return result
    }
    if (isString(key)) {
      return `${result} ${key}`
    }
    const keys = Object.keys(key)
    const computed = keys.reduce((prev, c) => {
      if (key[c]) {
        return `${prev} ${c}`
      }
      return prev
    }, '')

    return `${result} ${computed}`
  }, '')
}
