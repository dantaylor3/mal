import * as readline from 'node:readline'

import log from 'loglevel'
log.setDefaultLevel('info')

import {printStr} from './printer'
import {readStr} from './reader'
import {CozyType} from './types'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function read(str: string): any {
  return readStr(str)
}

function evalCozy(ast: any, _env?: any): any {
  // TODO
  return ast
}

function print(exp: CozyType): string {
  return printStr(exp)
}

function rep(str: string): string {
  return print(evalCozy(read(str)))
}

const waitForInput = () =>
  rl.question('>', answer => {
    if (answer === 'exit') {
      rl.close()
    } else {
      try {
        log.info(rep(answer))
      } catch (ex) {
        log.error((ex as Error).message)
      }
      waitForInput()
    }
  })
waitForInput()
