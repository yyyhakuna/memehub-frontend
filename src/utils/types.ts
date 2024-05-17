export type VoidFn = () => void

export enum Order {
  Asc,

  Desc,
}

export type Pair<T = string, V = string> = [T, V]

export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

export type RequirePick<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>
