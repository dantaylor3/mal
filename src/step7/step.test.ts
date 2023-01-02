import {step6Tests} from '../step6/step.test'

import {createRepl} from '.'

step6Tests()

export const step7Tests = () =>
  describe('step 7', () => {
    describe('cons', () => {
      const repl = createRepl()

      it.each([
        ['(cons 1 (list))', '(1)'],
        ['(cons 1 (list 2))', '(1 2)'],
        ['(cons 1 (list 2 3))', '(1 2 3)'],
        ['(cons (list 1) (list 2 3))', '((1) 2 3)'],
        ['(def! a (list 2 3))', '(2 3)'],
        ['(cons 1 a)', '(1 2 3)'],
        ['a', '(2 3)'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('concat', () => {
      const repl = createRepl()

      it.each([
        ['(concat)', '()'],
        ['(concat (list 1 2))', '(1 2)'],
        ['(concat (list 1 2) (list 3 4))', '(1 2 3 4)'],
        ['(concat (list 1 2) (list 3 4) (list 5 6))', '(1 2 3 4 5 6)'],
        ['(concat (concat))', '()'],
        ['(concat (list) (list))', '()'],
        ['(= () (concat))', 'true'],
        ['(def! a (list 1 2))', '(1 2)'],
        ['(def! b (list 3 4))', '(3 4)'],
        ['(concat a b (list 5 6))', '(1 2 3 4 5 6)'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('quoting', () => {
      const repl = createRepl()

      it.each([
        ['(quote 7)', '7'],
        ['(quote (1 2 3))', '(1 2 3)'],
        ['(quote (1 2 (3 4)))', '(1 2 (3 4))'],
        ["'7", '7'],
        ["'(1 2 3)", '(1 2 3)'],
        ["'(1 2 (3 4))", '(1 2 (3 4))'],
        ["(concat (list 'a 'b) (list 'c 'd))", '(a b c d)'],
        ['(= (quote abc) (quote abc))', 'true'],
        ['(= (quote abc) (quote abcd))', 'false'],
        ['(= (quote abc) "abc")', 'false'],
        ['(= "abc" (quote abc))', 'false'],
        ['(= "abc" (str (quote abc)))', 'true'],
        ['(= (quote abc) null)', 'false'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('quasiquote', () => {
      const repl = createRepl()

      it.each([
        ['(quasiquote 7)', '7'],
        ['(quasiquote a)', 'a'],
        ['(quasiquote ())', '()'],
        ['(quasiquote (a))', '(a)'],
        ['(quasiquote (1 2 3))', '(1 2 3)'],
        ['(quasiquote (1 2 (3 4)))', '(1 2 (3 4))'],
        ['(quasiquote (null))', '(null)'],
        ['(quasiquote (1 ()))', '(1 ())'],
        ['(quasiquote (() 1))', '(() 1)'],
        ['(quasiquote (1 () 2))', '(1 () 2)'],
        ['(quasiquote (()))', '(())'],
        ['(quasiquote (unquote 7))', '7'],
        ['(def! a 8)', '8'],
        ['(quasiquote a)', 'a'],
        ['(quasiquote (unquote a))', '8'],
        ['(quasiquote (1 a 3))', '(1 a 3)'],
        ['(quasiquote (1 (unquote a) 3))', '(1 8 3)'],
        ['`(1 ~a 3)', '(1 8 3)'],
        ['(def! b (quote (1 "b" "d")))', '(1 "b" "d")'],
        ['`(1 b 3)', '(1 b 3)'],
        ['(quasiquote (1 b 3))', '(1 b 3)'],
        ['(quasiquote (1 (unquote b) 3))', '(1 (1 "b" "d") 3)'],
        ['`(1 ~b 3)', '(1 (1 "b" "d") 3)'],
        ['(quasiquote ((unquote 1) (unquote 2)))', '(1 2)'],
        ['(let* (x 0) (quasiquote (unquote x)))', '0'],
        ['`(1 2 3)', '(1 2 3)'],
        ['`(1 2 (3 4))', '(1 2 (3 4))'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })
step7Tests()
