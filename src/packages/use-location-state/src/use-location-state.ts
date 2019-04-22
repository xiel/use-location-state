import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMergedQuery, parseQueryState, QueryState } from 'query-state-core'
export { useLocationHashQueryStringInterface } from './hooks/useLocationHashQueryStringInterface'

type QueryString = string

export interface QueryStringInterface {
  getQueryString: () => QueryString
  setQueryString: (newQueryString: QueryString, opts: SetQueryStringOptions) => void
}

export type QueryStateOpts = {
  stripDefaults?: boolean
  queryStringInterface: QueryStringInterface
}

export interface SetQueryStringOptions {
  method?: 'push' | 'replace'
}

export function useLocationQueryParams<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOpts
) {
  const { queryStringInterface } = queryStateOpts
  const queryString = queryStringInterface.getQueryString()
  const [_, setLatestMergedQueryString] = useState<string>()
  const queryState: Partial<T> & QueryState = useMemo(
    () => ({
      ...defaultQueryState,
      ...parseQueryState(queryString),
    }),
    [defaultQueryState, queryString]
  )
  type QST = typeof queryState

  const ref = useRef({
    defaultQueryState,
    queryStateOpts,
  })

  const setQueryState = useCallback(
    (newState: Partial<T> & QueryState, opts?: SetQueryStringOptions) => {
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
      const currentQueryState: QST = {
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

  // TODO: use array as well
  return { queryState, setQueryState }
}

export function useLocationQueryParam<T>(
  paramName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOpts
): [T, (newValue: T, opts?: SetQueryStringOptions) => void] {
  const defaultQueryState = useMemo(() => ({ [paramName]: defaultValue }), [
    paramName,
    defaultValue,
  ])
  const { queryState, setQueryState } = useLocationQueryParams(defaultQueryState, queryStateOpts)
  const setParam = useCallback(
    (newValue: T, opts?: SetQueryStringOptions) => setQueryState({ [paramName]: newValue }, opts),
    [paramName, setQueryState]
  )

  // fallback to default value
  const paramValue = queryState[paramName]
  const value: T = paramValue === undefined ? defaultValue : paramValue

  return [value, setParam]
}
