import {step8Tests} from '../step8/step.test'

import {createRepl} from '.'

step8Tests()

export const step9Tests = () =>
  describe('step 9', () => {
    describe('try/catch', () => {
      const repl = createRepl()

      it.each([
        ['(try* 123 (catch* e 456))', '123'],
        ['(try* abc (catch* e 456))', '456'],
        ['(try* abc (catch* e e))', '"`abc` not found in env"'],
        ['(try* (throw "my exception") (catch* e e))', '"my exception"'],
        ['(try* (do (try* "t1" (catch* e "c1")) (throw "e1")) (catch* e "c2"))', '"c2"'],
        ['(try* (try* (throw "e1") (catch* e (throw "e2"))) (catch* e "c2"))', '"c2"'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('apply', () => {
      const repl = createRepl()

      it.each([
        ['(apply + (list 2 3))', '5'],
        ['(apply (fn* (a b) (+ a b)) (list 4 5))', '9'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('map', () => {
      const repl = createRepl()

      it.each([
        ['(def! nums (list 1 2 3))', '(1 2 3)'],
        ['(def! double (fn* (a) (* 2 a)))', '#<function>'],
        ['(double 3)', '6'],
        ['(map double nums) ', '(2 4 6)'],
        ['(map (fn* (x) (symbol? x)) (list 1 (quote two) "three"))', '(false true false)'],
        ['(= () (map str ()))', 'true'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })
step9Tests()
