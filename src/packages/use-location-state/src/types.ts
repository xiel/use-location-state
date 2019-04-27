import { QueryStateMerge } from 'query-state-core'

export type QueryString = string
export type ValueType = string | string[] | number | boolean

export type SetQueryStateFn<T> = (
  newState: QueryStateMerge,
  opts?: SetQueryStringOptions
) => void

export type SetQueryStateItemFn<T> = (newValue: T , opts?: SetQueryStringOptions) => void

export interface QueryStringInterface {
  getQueryString: () => QueryString
  setQueryString: (newQueryString: QueryString, opts: SetQueryStringOptions) => void
}

export type QueryStateOpts = {
  stripDefaults?: boolean
  queryStringInterface: QueryStringInterface
}

export type QueryStateOptsSetInterface = {
  stripDefaults?: boolean
}

export interface SetQueryStringOptions {
  method?: 'push' | 'replace'
}
