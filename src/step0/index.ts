import * as readline from 'node:readline'

import log from 'loglevel'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function read(str: string): any {
  return str
}

function evalCozy(ast: any, _env?: any): any {
  return ast
}

function print(exp: any): string {
  return exp
}

function rep(str: string): string {
  return print(evalCozy(read(str)))
}

const waitForInput = () =>
  rl.question('>', answer => {
    if (answer === 'exit') {
      rl.close()
    } else {
      log.info(rep(answer))
      waitForInput()
    }
  })
waitForInput()
