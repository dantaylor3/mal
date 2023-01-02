export type CozyBase<T extends string, V> = {t: T; v: V}
export type CozyList = CozyBase<'list', CozyType[]>
export type CozyNull = CozyBase<'null', null>
export type CozySymbol = CozyBase<'symbol', string>
export type CozyNumber = CozyBase<'number', number>
export type CozyString = CozyBase<'string', string>
export type CozyBoolean = CozyBase<'boolean', boolean>
export type CozyFunction = CozyBase<'function', (...args: CozyType[]) => CozyType> & {isMacro: boolean}

export const List = (v: CozyType[]): CozyList => ({t: 'list', v})
export const Null: CozyNull = {t: 'null', v: null}
export const Symbol = (v: string): CozySymbol => ({t: 'symbol', v})
export const Number = (v: number): CozyNumber => ({t: 'number', v})
export const String = (v: string): CozyString => ({t: 'string', v})
export const Boolean = (v: boolean): CozyBoolean => ({t: 'boolean', v})
export const Function = (v: (...args: CozyType[]) => CozyType, isMacro = false): CozyFunction => ({
  t: 'function',
  v,
  isMacro,
})

export type CozyType = CozyNull | CozyList | CozySymbol | CozyNumber | CozyString | CozyBoolean | CozyFunction

export function assertCozyArray<T extends CozyType['t']>(type: T, a: any[]): asserts a is Extract<CozyType, {t: T}>[] {
  a.forEach(e => {
    if (e.t !== type) throw new Error(`expected type \`${type}\` but received type \`${e.t}\``)
  })
}

export function assertCozyType<T extends CozyType['t']>(t: T, v: CozyType): asserts v is Extract<CozyType, {t: T}> {
  if (v.t !== t) throw new Error(`expected type \`${t}\` but received type \`${v.t}\``)
}
