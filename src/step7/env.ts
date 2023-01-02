import assert from 'assert'

import {CozySymbol, CozyType} from './types'

export type Env = {
  get: (key: CozySymbol) => CozyType
  set: (key: CozySymbol, value: CozyType) => CozyType
  _dump: () => Record<string, CozyType>
}

export function createFromMap(data: Record<string, CozyType>, parent?: Env): Env {
  const _data: Record<string, CozyType> = {...data}
  return {
    set: (key, value) => {
      _data[key.v] = value
      return value
    },
    get: key => {
      const selfValue = _data[key.v]
      if (selfValue !== undefined) return selfValue

      const parentValue = parent?.get(key)
      if (parentValue !== undefined) return parentValue

      throw new Error(`\`${key.v}\` not found in env`)
    },
    _dump: () => ({..._data, ...parent?._dump()}),
  }
}

export function create(binds: CozySymbol[] = [], exports: CozyType[] = [], parent?: Env) {
  assert.ok(binds.length === exports.length)
  const data: Record<string, CozyType> = binds.reduce((prev, curr, i) => {
    prev[curr.v] = exports[i]
    return prev
  }, {} as Record<string, CozyType>)

  return createFromMap(data, parent)
}
