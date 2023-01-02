import path from 'path'

import {step1Tests} from '../step1/step.test'
import {step2Tests} from '../step2/step.test'
import {step3Tests} from '../step3/step.test'
import {step4Tests} from '../step4/step.test'

import {createRepl} from '.'

step1Tests()
step2Tests()
step3Tests()
step4Tests()

export const step6Tests = () =>
  describe('step 6', () => {
    describe('read-string', () => {
      const repl = createRepl()

      it.each([
        ['(read-string "(1 2 (3 4) null)")', '(1 2 (3 4) null)'],
        ['(= null (read-string "null"))', 'true'],
        ['(read-string "(+ 2 3)")', '(+ 2 3)'],
        ['(read-string "7 ;; comment")', '7'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('eval', () => {
      const repl = createRepl()

      it.each([
        ['(eval (read-string "(+ 2 3)"))', '5'],
        [
          `(slurp "${path.join(__dirname, './test.cozy')}")`,
          '(def! inc3 (fn* (a) (+ 3 a))) ; increment the number by 3\n(def! inc4 (fn* (a) (+ 4 a)))',
        ],
        [`(load-file "${path.join(__dirname, './test.cozy')}")`, 'null'],
        ['(inc3 5)', '8'],
        ['(inc4 5)', '9'],
        ['(let* (b 12) (do (eval (read-string "(def! aa 7)")) aa ))', '7'], // eval handles nested scopes

        // eval should not use local environments
        ['(def! a 1)', '1'],
        ['(let* (a 2) (eval (read-string "a")))', '1'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })
step6Tests()
