import * as readline from 'readline'
import * as util from 'util'

import log from 'loglevel'
log.setDefaultLevel('debug')

import {globalEnv} from './core'
import {create, Env} from './env'
import {printStr} from './printer'
import {readStr} from './reader'
import {CozyType, Symbol, List} from './types'

function evalCozy(ast: CozyType, env: Env): CozyType {
  switch (ast.t) {
    // reduce symbols by looking them up in the env
    case 'symbol':
      return env.get(Symbol(ast.v))

    case 'list': {
      // if there aren't any items in the list, cannot reduce
      if (ast.v.length === 0) return ast

      // reduce all of the elements in the list
      const result = List(ast.v.map(e => evalCozy(e, env)))

      switch (result.v[0].t) {
        // if first element is a function, to reduce, we have to call it
        case 'function': {
          const [f, ...args] = result.v
          return f.v(...args)
        }
        // if there wasn't a way to reduce the list, return it
        default:
          return result
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

log.info(createRepl()('(+ 2 (* 3 4))'))

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// })
// const repl = createRepl()
// const waitForInput = () =>
//   rl.question('>', answer => {
//     if (answer === 'exit') {
//       rl.close()
//     } else {
//       try {
//         log.info(repl(answer))
//       } catch (ex) {
//         log.error((ex as Error).message)
//       }
//       waitForInput()
//     }
//   })
// waitForInput()
