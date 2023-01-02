export type CozyBase<T extends string, V> = {t: T; v: V}
export type CozyList = CozyBase<'list', CozyType[]>
export type CozyNull = CozyBase<'null', null>
export type CozySymbol = CozyBase<'symbol', string>
export type CozyNumber = CozyBase<'number', number>
export type CozyString = CozyBase<'string', string>
export type CozyBoolean = CozyBase<'boolean', boolean>

export type CozyType = CozyNull | CozyList | CozySymbol | CozyNumber | CozyString | CozyBoolean

export const Null: CozyNull = {t: 'null', v: null}
