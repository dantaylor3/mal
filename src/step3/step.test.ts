import {step1Tests} from '../step1/step.test'
import {step2Tests} from '../step2/step.test'

import {createRepl} from '.'

step1Tests()
step2Tests()

export const step3Tests = () =>
  describe('step 3', () => {
    describe('def!', () => {
      const repl = createRepl()

      it.each([
        ['happy path', '(def! x 3)', '3'],
        ['happy path', 'x', '3'],
        ['happy path', '(def! x 4)', '4'],
        ['happy path', 'x', '4'],
        ['happy path', '(def! y (+ 1 7))', '8'],
        ['happy path', 'y', '8'],
        ['case sensitive', '(def! mynum 111)', '111'],
        ['case sensitive', '(def! MYNUM 222)', '222'],
        ['case sensitive', 'mynum', '111'],
        ['case sensitive', 'MYNUM', '222'],
      ])('%s: %s should evaluate to %s', (_tag, input, output) => {
        expect(repl(input)).toEqual(output)
      })

      it('env lookup should fail and abort def!', () => {
        expect(() => repl('(abc 1 2 3)')).toThrowError('`abc` not found in env')
        expect(repl('(def! w 123)')).toEqual('123')
        expect(() => repl('(def! w (abc))')).toThrowError('`abc` not found in env')
        expect(repl('w')).toEqual('123')
      })
    })

    describe('let*', () => {
      const repl = createRepl()

      it.each([
        ['(def! x 4)', '4'],
        ['(let* (z 9) z)', '9'],
        ['(let* (x 9) x)', '9'],
        ['x', '4'],
        ['(let* (p (+ 2 3) q (+ 2 p)) (+ p q))', '12'],
        ['(def! y (let* (z 7) z))', '7'],
        ['y', '7'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })

    describe('nested envs', () => {
      const repl = createRepl()

      it.each([
        ['(def! a 4)', '4'],
        ['(let* (q 9) q)', '9'],
        ['(let* (q 9) a)', '4'],
        ['(let* (z 2) (let* (q 9) a))', '4'],
        ['(let* (z 2) (let* (q 9) z))', '2'],
      ])('%s should evaluate to %s', (input, output) => {
        expect(repl(input)).toEqual(output)
      })
    })
  })

step3Tests()
