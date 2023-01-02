import {printStr} from './printer'
import {readStr} from './reader'

export const step1Tests = () =>
  describe('step 1', () => {
    it.each([
      ['numbers', '1', '1'],
      ['numbers', '7', '7'],
      ['numbers', '-123', '-123'],
      ['numbers', '-abc', '-abc'],
      ['booleans', 'false', 'false'],
      ['booleans', 'true', 'true'],
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

step1Tests()
