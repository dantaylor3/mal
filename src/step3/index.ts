import assert from 'assert'
import * as util from 'util'

import log from 'loglevel'
log.setDefaultLevel('debug')

import {globalEnv} from './core'
import {create, createFromMap, Env} from './env'
import {printStr} from './printer'
import {readStr} from './reader'
import {CozyType, Symbol, List, assertCozyType} from './types'

function evalCozy(ast: CozyType, env: Env): CozyType {
  switch (ast.t) {
    // reduce symbols by looking them up in the env
    case 'symbol':
      return env.get(Symbol(ast.v))

    case 'list': {
      // if there aren't any items in the list, cannot reduce
      if (ast.v.length === 0) return ast

      // if the first element isn't a symbol (udf or built-in fn)
      if (ast.v[0].t !== 'symbol') return List(ast.v.map(e => evalCozy(e, env)))

      // handle special functions before falling back to evaluating the symbol
      switch (ast.v[0].v) {
        case 'def!':
          assert.ok(ast.v.length === 3, 'def! requires 2 parameters')
          assertCozyType('symbol', ast.v[1])
          return env.set(ast.v[1], evalCozy(ast.v[2], env))
        case 'let*': {
          const newEnv = createFromMap({}, env)
          const pairs = ast.v[1]
          assertCozyType('list', pairs)

          for (let i = 0; i < pairs.v.length; i += 2) {
            const key: CozyType = pairs.v[i]
            const value = pairs.v[i + 1]
            assertCozyType('symbol', key)

            if (key === undefined || value === undefined) {
              throw new Error('unexpected syntax: missing parameter in let env declaration')
            }

            newEnv.set(key, evalCozy(value, newEnv))
          }

          return evalCozy(ast.v[2], newEnv)
        }
        default: {
          // since first symbol isn't a special case, list must be treated as a function
          // (1 2 3) for example should fail since 1 is not defined
          const result = List(ast.v.map(e => evalCozy(e, env)))
          const [first, ...rest] = result.v
          assertCozyType('function', first)
          return first.v(...rest)
        }
      }
    }
    // no way to reduce primitives like numbers
    default:
      return ast
  }
}

export const createRepl = () => {
  const env = create([], [], globalEnv)

  return (input: string) => {
    const ast = readStr(input)
    log.debug(util.inspect(ast, {depth: 10}))
    return printStr(evalCozy(ast, env))
  }
}

log.info(createRepl()('(* 3 4)'))
