import assert from 'assert'

import {createFromMap, Env} from './env'
import {assertCozyArray, Function, Number} from './types'

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
})
