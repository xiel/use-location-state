import { QueryStateMerge } from 'query-state-core'

export type QueryString = string

export type SetQueryStateFn<T> = (
  newState: QueryStateMerge,
  opts?: SetQueryStringOptions
) => void

export interface QueryStringInterface {
  getQueryString: () => QueryString
  setQueryString: (
    newQueryString: QueryString,
    opts: SetQueryStringOptions
  ) => void
}

export interface SetQueryStringOptions {
  method?: 'replace' | 'push'
}

export type QueryStateOpts = {
  stripDefaults?: boolean
  queryStringInterface?: QueryStringInterface
}

export type QueryStateOptsSetInterface = {
  stripDefaults?: boolean
}

export type QueryStateType = string | number | boolean | Date | string[]
