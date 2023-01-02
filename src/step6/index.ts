import assert from 'assert'
import * as util from 'util'

import log from 'loglevel'
log.setDefaultLevel('debug')

import {globalEnv} from './core'
import {create, createFromMap, Env} from './env'
import {printStr} from './printer'
import {readStr} from './reader'
import {CozyType, Symbol, List, assertCozyType, Null, Function, assertCozyArray} from './types'

export function evalCozy(ast: CozyType, env: Env): CozyType {
  switch (ast.t) {
    // reduce symbols by looking them up in the env
    case 'symbol':
      return env.get(Symbol(ast.v))

    case 'list': {
      // if there aren't any items in the list, cannot reduce
      if (ast.v.length === 0) return ast

      // handle special functions
      if (ast.v[0].t === 'symbol') {
        switch (ast.v[0].v) {
          case 'fn*': {
            const [, args, binds] = ast.v
            assertCozyType('list', args)
            const symbols = args.v
            assertCozyArray('symbol', symbols)
            return Function((...args) => evalCozy(binds, create(symbols, args, env)))
          }
          case 'do':
            return ast.v
              .slice(1)
              .map(e => evalCozy(e, env))
              .slice(-1)[0]
          case 'if': {
            const [, condition, trueClause, falseClause] = ast.v

            const condResult = evalCozy(condition, env)
            if (condResult.t !== 'null' && (condResult.t !== 'boolean' || condResult.v !== false))
              return evalCozy(trueClause, env)
            else if (falseClause !== undefined) return evalCozy(falseClause, env)
            else return Null
          }
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
        }
      }

      // since first symbol isn't a special case, list must be treated as a function
      // (1 2 3) for example should fail since 1 is not defined
      const result = List(ast.v.map(e => evalCozy(e, env)))
      const [first, ...rest] = result.v
      assertCozyType('function', first)
      return first.v(...rest)
    }
    // no way to reduce primitives like numbers
    default:
      return ast
  }
}

export const createRepl = () => {
  const env = create([], [], globalEnv)

  // this cannot be in core because we need to reference $env in the repl
  env.set(
    Symbol('eval'),
    Function((...args) => {
      assert.ok(args.length === 1)
      return evalCozy(args[0], env)
    })
  )

  // define core language features using MAL itself
  evalCozy(readStr('(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnull)")))))'), env)

  return (input: string) => {
    const ast = readStr(input)
    log.debug(util.inspect(ast, {depth: 10}))
    return printStr(evalCozy(ast, env))
  }
}
