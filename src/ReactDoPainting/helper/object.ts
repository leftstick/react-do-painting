export function id() {
  const base = 'abcdefghijklmnopqrstuvwxyz'
  const i0 = Math.floor(Math.random() * 26)
  const i1 = Math.floor(Math.random() * 26)
  const i2 = Math.floor(Math.random() * 26)
  return `${base[i0]}${base[i1]}${base[i2]}-${new Date().getTime()}`
}

export function capitalize(str: string) {
  return str.toLowerCase().replace(/^[a-z]/, (word) => {
    return word.toUpperCase()
  })
}

export function isString(obj: any): obj is string {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isNumeric(obj: any): boolean {
  const NUM_REG = /^-?\d+(\.\d+)?$/
  if (Object.prototype.toString.call(obj) === '[object Number]') {
    return true
  }
  if (isString(obj)) {
    return NUM_REG.test(obj)
  }
  return false
}
