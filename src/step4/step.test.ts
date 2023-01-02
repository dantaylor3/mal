import {step1Tests} from '../step1/step.test'
import {step2Tests} from '../step2/step.test'
import {step3Tests} from '../step3/step.test'

import {createRepl} from '.'

step1Tests()
step2Tests()
step3Tests()

export const step4Tests = () =>
  describe('step 3', () => {
    describe('do', () => {
      const repl = createRepl()

      it.each([
        ['(do (prn 101) (prn 102) (+ 1 2))', '3'],
        ['(do (def! a 6) 7 (+ a 8))', '14'],
        ['a', '6'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('if', () => {
      const repl = createRepl()

      it.each([
        ['(if true 7 8)', '7'],
        ['(if false 7 8)', '8'],
        ['(if false 7 false)', 'false'],
        ['(if true (+ 1 7) (+ 1 8))', '8'],
        ['(if false (+ 1 7) (+ 1 8))', '9'],
        ['(if null 7 8)', '8'],
        ['(if 0 7 8)', '7'],
        ['(if (list) 7 8)', '7'],
        ['(if (list 1 2 3) 7 8)', '7'],
        ['(if false (+ 1 7))', 'null'],
        ['(if null 8)', 'null'],
        ['(if null 8 7)', '7'],
        ['(if true (+ 1 7))', '8'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('fn*', () => {
      const repl = createRepl()

      it.each([
        ['( (fn* (a b) (+ b a)) 3 4)', '7'],
        ['( (fn* () 4) )', '4'],
        ['( (fn* (f x) (f x)) (fn* (a) (+ 1 a)) 7)', '8'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('recursion', () => {
      const repl = createRepl()

      it.each([
        ['(def! sumdown (fn* (N) (if (> N 0) (+ N (sumdown  (- N 1))) 0)))', '#<function>'],
        ['(sumdown 1)', '1'],
        ['(sumdown 2)', '3'],
        ['(sumdown 6)', '21'],
        ['(def! fib (fn* (N) (if (= N 0) 1 (if (= N 1) 1 (+ (fib (- N 1)) (fib (- N 2)))))))', '#<function>'],
        ['(fib 1)', '1'],
        ['(fib 2)', '2'],
        ['(fib 4)', '5'],
        ['(let* (f (fn* () x) x 3) (f))', '3'],
        ['(let* (cst (fn* (n) (if (= n 0) null (cst (- n 1))))) (cst 1))', 'null'],
        ['(let* (f (fn* (n) (if (= n 0) 0 (g (- n 1)))) g (fn* (n) (f n))) (f 2))', '0'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('closures', () => {
      const repl = createRepl()

      it.each([
        ['( ( (fn* (a) (fn* (b) (+ a b))) 5) 7)', '12'],
        ['(def! gen-plus5 (fn* () (fn* (b) (+ 5 b))))', '#<function>'],
        ['(def! plus5 (gen-plus5))', '#<function>'],
        ['(plus5 7)', '12'],
        ['(def! gen-plusX (fn* (x) (fn* (b) (+ x b))))', '#<function>'],
        ['(def! plus7 (gen-plusX 7))', '#<function>'],
        ['(plus7 8)', '15'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('list fns', () => {
      const repl = createRepl()

      it.each([
        ['(list)', '()'],
        ['(list? (list))', 'true'],
        ['(empty? (list))', 'true'],
        ['(empty? (list 1))', 'false'],
        ['(list 1 2 3)', '(1 2 3)'],
        ['(count (list 1 2 3))', '3'],
        ['(count (list))', '0'],
        ['(count null)', '0'],
        ['(if (> (count (list 1 2 3)) 3) 89 78)', '78'],
        ['(if (>= (count (list 1 2 3)) 3) 89 78)', '89'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('conditional logic', () => {
      const repl = createRepl()

      it.each([
        ['(= 2 1)', 'false'],
        ['(= 1 1)', 'true'],
        ['(= 1 2)', 'false'],
        ['(= 1 (+ 1 1))', 'false'],
        ['(= 2 (+ 1 1))', 'true'],
        ['(= null 1)', 'false'],
        ['(= null null)', 'true'],
        ['(> 2 1)', 'true'],
        ['(> 1 1)', 'false'],
        ['(> 1 2)', 'false'],
        ['(>= 2 1)', 'true'],
        ['(>= 1 1)', 'true'],
        ['(>= 1 2)', 'false'],
        ['(< 2 1)', 'false'],
        ['(< 1 1)', 'false'],
        ['(< 1 2)', 'true'],
        ['(<= 2 1)', 'false'],
        ['(<= 1 1)', 'true'],
        ['(<= 1 2)', 'true'],
        ['(= 1 1)', 'true'],
        ['(= 0 0)', 'true'],
        ['(= 1 0)', 'false'],
        ['(= true true)', 'true'],
        ['(= false false)', 'true'],
        ['(= null null)', 'true'],
        ['(= (list) (list))', 'true'],
        ['(= (list) ())', 'true'],
        ['(= (list 1 2) (list 1 2))', 'true'],
        ['(= (list 1) (list))', 'false'],
        ['(= (list) (list 1))', 'false'],
        ['(= 0 (list))', 'false'],
        ['(= (list) 0)', 'false'],
        ['(= (list null) (list))', 'false'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })

step4Tests()
