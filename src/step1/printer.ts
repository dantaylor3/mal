import {CozyType} from './types'

export const printStr = (t: CozyType): string => {
  switch (t.t) {
    case 'list':
      return `(${t.v.map(e => printStr(e)).join(' ')})`
    case 'number':
    case 'symbol':
    case 'boolean':
    case 'string':
      return `${t.v}`
    case 'null':
      return 'null'
  }
}
