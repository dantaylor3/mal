import {printStr} from './printer'
import {readStr} from './reader'

import {createRepl} from '.'

describe('step 1', () => {
  it.each([
    ['numbers', '1', '1'],
    ['numbers', '7', '7'],
    ['numbers', '-123', '-123'],
    ['numbers', '-abc', '-abc'],
    ['symbols', 'abc', 'abc'],
    ['symbols', 'abc5', 'abc5'],
    ['symbols', 'abc-def', 'abc-def'],
    ['symbols', 'abc', 'abc'],
    ['list', '(+ 1 2)', '(+ 1 2)'],
    ['list', '((3 4))', '((3 4))'],
    ['list', '( +   1   (+   2 3   )   )  ', '(+ 1 (+ 2 3))'],
    ['list', '(** 1 2)', '(** 1 2)'],
    ['commas as whitespace', '(1 2, 3,,,,),,', '(1 2 3)'],
  ])('%s: %s should evaluate to %s', (_tag, input, output) => {
    expect(printStr(readStr(input))).toEqual(output)
  })
})

describe('step 2', () => {
  it.each([
    ['arithmatic', '(+ 1 2)', '3'],
    ['arithmatic', '(+ 5 (* 2 3))', '11'],
    ['arithmatic', '(- (+ 5 (* 2 3)) 3)', '8'],
    ['arithmatic', '(/ (- (+ 5 (* 2 3)) 3) 4)', '2'],
    ['arithmatic', '(/ (- (+ 515 (* 87 311)) 302) 27)', '1010'],
    ['arithmatic', '(* -3 6)', '-18'],
    ['arithmatic', '(/ (- (+ 515 (* -87 311)) 296) 27)', '-994'],
    ['empty list', '()', '()'],
  ])('%s: %s should evaluate to %s', (_tag, input, output) => {
    expect(createRepl()(input)).toEqual(output)
  })

  it('should throw an error', () => {
    expect(() => createRepl()('(abc 1 2 3)')).toThrowError('`abc` not found in env')
  })
})
