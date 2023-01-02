import {step1Tests} from '../step1/step.test'

import {createRepl} from '.'

step1Tests()

export const step2Tests = () =>
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
step2Tests()
