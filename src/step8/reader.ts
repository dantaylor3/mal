import {CozyType, List, Symbol} from './types'

type Reader = ReturnType<typeof createReader>
export const createReader = (tokens: string[]) => {
  let position = 0

  const peek = (): string | undefined => tokens[position]
  const next = (): string => {
    const t = tokens[position++]
    if (t === undefined) throw new Error('unexpected EOF')
    return t
  }
  const matchNextToken = (expected: string) => {
    const nextToken = peek()
    if (nextToken === expected) return next()
    throw new Error(`expected \`${expected}\` but got \`${next}\``)
  }

  return {
    next,
    peek,
    matchNextToken,
  }
}

const tokenize = (str: string) => {
  const matches = [...str.matchAll(/[\s,]*(~@|[\\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\\[\]{}('"`,;)]*)/g)]
  return matches.map(m => m[1]).filter(m => m !== '' && m[0] !== ';')
}

export const readStr = (str: string): CozyType => {
  return readForm(createReader(tokenize(str)))
}

const readForm = (reader: Reader): CozyType => {
  const token = reader.peek()
  switch (token) {
    case '(':
      return readList(reader)
    case "'":
      reader.matchNextToken("'")
      return List([Symbol('quote'), readForm(reader)])
    case '~':
      reader.matchNextToken('~')
      return List([Symbol('unquote'), readForm(reader)])
    case '`':
      reader.matchNextToken('`')
      return List([Symbol('quasiquote'), readForm(reader)])
    default:
      return readAtom(reader)
  }
}

const readList = (reader: Reader): CozyType => {
  reader.matchNextToken('(')

  const list: CozyType[] = []
  let token: string | undefined
  while ((token = reader.peek()) !== ')') {
    if (token === undefined) throw new Error('unexpected EOF')
    list.push(readForm(reader))
  }
  reader.matchNextToken(')')

  return {t: 'list', v: list}
}

const readAtom = (reader: Reader): CozyType => {
  const token = reader.next()

  if (!isNaN(parseFloat(token))) return {t: 'number', v: parseFloat(token)}
  else if (token === 'null') return {t: 'null', v: null}
  else if (token === 'true') return {t: 'boolean', v: true}
  else if (token === 'false') return {t: 'boolean', v: false}
  else if (token.match(/^"[^"]*"$/)) return {t: 'string', v: token.slice(1, token.length - 1)}
  else return {t: 'symbol', v: token}
}
