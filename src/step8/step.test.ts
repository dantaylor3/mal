import {step1Tests} from '../step1/step.test'
import {step2Tests} from '../step2/step.test'
import {step3Tests} from '../step3/step.test'
import {step4Tests} from '../step4/step.test'
import {step6Tests} from '../step6/step.test'
import {step7Tests} from '../step7/step.test'

import {createRepl} from '.'

step1Tests()
step2Tests()
step3Tests()
step4Tests()
step6Tests()
step7Tests()

export const step8Tests = () =>
  describe('step 8', () => {
    describe('macros', () => {
      const repl = createRepl()

      it.each([
        ['(defmacro! one (fn* () 1))', '#<function>'],
        ['(defmacro! two (fn* () 2))', '#<function>'],
        ['(one)', '1'],
        ['(two)', '2'],
        ["(defmacro! setboth (fn* (a b v) (list 'do (list 'def! 'a v) (list 'def! 'b v))))", '#<function>'],
        ['(setboth a b 12)', '12'],
        ['a', '12'],
        ['b', '12'],
        ['(defmacro! unless (fn* (pred a b) `(if ~pred ~b ~a)))', '#<function>'],
        ['(unless false 7 8)', '7'],
        ['(unless true 7 8)', '8'],
        ["(defmacro! unless2 (fn* (pred a b) (list 'if (list 'not pred) a b)))", '#<function>'],
        ['(unless false 7 8)', '7'],
        ['(unless true 7 8)', '8'],

        ['(macroexpand (one))', '1'],
        ['(macroexpand (unless PRED A B))', '(if PRED B A)'],
        ['(macroexpand (unless2 PRED A B))', '(if (not PRED) A B)'],
        ['(macroexpand (unless2 2 3 4))', '(if (not 2) 3 4)'],

        ['(defmacro! identity (fn* (x) x))', '#<function>'],
        ['(let* (a 123) (macroexpand (identity a)))', 'a'],
        ['(let* (a 123) (identity a))', '123'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })
step8Tests()
