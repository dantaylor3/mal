import assert from 'assert'

import {createFromMap, Env} from './env'
import {printStr} from './printer'
import {assertCozyArray, assertCozyType, Boolean, CozyBoolean, CozyType, Function, List, Null, Number} from './types'

export const globalEnv: Env = createFromMap({
  '+': Function((...args) => {
    assertCozyArray('number', args)
    return Number(args.reduce((prev, curr) => prev + curr.v, 0))
  }),
  '-': Function((...args) => {
    assertCozyArray('number', args)
    assert.ok(args.length === 2)
    return Number(args[0].v - args[1].v)
  }),
  '*': Function((...args) => {
    assertCozyArray('number', args)
    return Number(args.reduce((prev, curr) => prev * curr.v, 1))
  }),
  '/': Function((...args) => {
    assertCozyArray('number', args)
    assert.ok(args.length === 2)
    return Number(args[0].v / args[1].v)
  }),
  prn: Function((...args) => {
    console.log(args.map(a => printStr(a)).join(' '))
    return Null
  }),
  list: Function((...args) => List(args)),
  'list?': Function((...args) => Boolean(args[0].t === 'list')),
  'empty?': Function((...args) => (args[0].t === 'list' ? Boolean(args[0].v.length === 0) : Boolean(false))),
  count: Function((...args) => {
    switch (args[0].t) {
      case 'list':
        return Number(args[0].v.length)
      case 'null':
        return Number(0)
    }
    throw new Error(`unexpected symbol type \`${args[0].v}\`, expected [list, nil]`)
  }),
  '<': Function((...args) => {
    const [a, b] = args
    assertCozyType('number', a)
    assertCozyType('number', b)
    return Boolean(a.v < b.v)
  }),
  '>': Function((...args) => {
    const [a, b] = args
    assertCozyType('number', a)
    assertCozyType('number', b)
    return Boolean(a.v > b.v)
  }),
  '<=': Function((...args) => {
    const [a, b] = args
    assertCozyType('number', a)
    assertCozyType('number', b)
    return Boolean(a.v <= b.v)
  }),
  '>=': Function((...args) => {
    const [a, b] = args
    assertCozyType('number', a)
    assertCozyType('number', b)
    return Boolean(a.v >= b.v)
  }),
  '=': Function((...args) => {
    const [a, b] = args
    const equals = (a: CozyType, b: CozyType): CozyBoolean => {
      if (a.t !== b.t) return Boolean(false)
      else if (a.t === 'null' || b.t === 'null') return Boolean(true)
      else {
        switch (a.t) {
          case 'boolean':
          case 'number':
          case 'symbol':
          case 'function':
          case 'string':
            return Boolean(a.v === b.v)
          case 'list':
            assertCozyType('list', b)
            if (a.v.length !== b.v.length) return Boolean(false)
            return Boolean(a.v.every((e, i) => equals(e, b.v[i])))
        }
      }
    }
    return equals(a, b)
  }),
})
