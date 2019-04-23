import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMergedQuery, parseQueryState, QueryState } from 'query-state-core'
import { useLocationHashQueryStringInterface } from './hooks/useLocationHashQueryStringInterface'
export { useLocationHashQueryStringInterface } from './hooks/useLocationHashQueryStringInterface'

type QueryString = string
type ExtendedQueryState<T> = Partial<T> & QueryState
type SetQueryStateFn<T> = (newState: ExtendedQueryState<T>, opts?: SetQueryStringOptions) => void
type SetQueryStateItemFn<T> = (newValue: T, opts?: SetQueryStringOptions) => void

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

export function useLocationQueryState<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOpts
): [ExtendedQueryState<T>, SetQueryStateFn<T>] {
  const { queryStringInterface } = queryStateOpts
  const queryString = queryStringInterface.getQueryString()
  const [_, setLatestMergedQueryString] = useState<string>()
  const queryState: ExtendedQueryState<T> = useMemo(
    () => ({
      ...defaultQueryState,
      ...parseQueryState(queryString),
    }),
    [defaultQueryState, queryString]
  )

  const ref = useRef({
    defaultQueryState,
    queryStateOpts,
  })

  const setQueryState = useCallback(
    (newState: ExtendedQueryState<T>, opts?: SetQueryStringOptions) => {
      const { defaultQueryState, queryStateOpts } = ref.current
      const { queryStringInterface, stripDefaults = true } = queryStateOpts
      const stripOverwrite: QueryState = {}

      // when a params are set to the same value as in the defaults
      // we remove them to avoid having two URLs reproducing the same state unless stripDefaults === false
      if (stripDefaults) {
        Object.entries(newState).forEach(([key]) => {
          if (defaultQueryState[key] === newState[key]) {
            stripOverwrite[key] = null
          }
        })
      }

      // retrieve the last value (by re-executing the search getter)
      const currentQueryState: ExtendedQueryState<T> = {
        ...defaultQueryState,
        ...parseQueryState(queryStringInterface.getQueryString()),
      }

      const mergedQueryString = createMergedQuery(currentQueryState || {}, newState, stripOverwrite)

      queryStringInterface.setQueryString(mergedQueryString, opts || {})

      // triggers an update (in case the QueryStringInterface misses to do so)
      setLatestMergedQueryString(mergedQueryString)
    },
    []
  )

  useEffect(() => {
    ref.current = {
      defaultQueryState,
      queryStateOpts,
    }
  })

  return [ queryState, setQueryState ]
}

export function useLocationHashQueryState<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
): [ExtendedQueryState<T>, SetQueryStateFn<T>] {
  const hashGSI = useLocationHashQueryStringInterface()
  return useLocationQueryState(defaultQueryState, {
    ...queryStateOpts,
    queryStringInterface: hashGSI
  })
}

export function useLocationQueryStateItem<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {
  const defaultQueryState = useMemo(() => ({ [itemName]: defaultValue }), [
    itemName,
    defaultValue,
  ])
  const [queryState, setQueryState] = useLocationQueryState(defaultQueryState, queryStateOpts)
  const setQueryStateItem = useCallback(
    (newValue: T, opts?: SetQueryStringOptions) => setQueryState({ [itemName]: newValue }, opts),
    [itemName, setQueryState]
  )

  // fallback to default value
  const paramValue = queryState[itemName]
  const value: T = paramValue === undefined ? defaultValue : paramValue

  return [value, setQueryStateItem]
}

export function useLocationHashQueryStateItem<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOptsSetInterface = {}
): [T, SetQueryStateItemFn<T>] {
  const hashGSI = useLocationHashQueryStringInterface()
  return useLocationQueryStateItem(itemName, defaultValue, {
    ...queryStateOpts,
    queryStringInterface: hashGSI
  })
}
