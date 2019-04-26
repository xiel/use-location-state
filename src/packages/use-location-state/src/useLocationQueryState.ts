import {
  ExtendedQueryState,
  QueryStateOpts,
  SetQueryStateFn,
  SetQueryStateItemFn,
  SetQueryStringOptions,
} from './types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMergedQuery, parseQueryState, QueryState } from 'query-state-core'
import { QueryStateMergable } from 'query-state-core/src/query-state-core'

export function useLocationQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOpts
): [ExtendedQueryState<T>, SetQueryStateFn<T>] {
  const { queryStringInterface } = queryStateOpts
  const queryString = queryStringInterface.getQueryString()
  const [, setLatestMergedQueryString] = useState<string>()
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
      const stripOverwrite: QueryStateMergable = {}

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

  return [queryState, setQueryState]
}

export function useLocationQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {

  const defaultQueryState = useMemo(() => ({ [itemName]: defaultValue }), [itemName, defaultValue])

  const [queryState, setQueryState] = useLocationQueryStateObj(defaultQueryState, queryStateOpts)
  const setQueryStateItem = useCallback(
    (newValue: T, opts?: SetQueryStringOptions) => setQueryState({ [itemName]: newValue }, opts),
    [itemName, setQueryState]
  )

  // fallback to default value
  const paramValue = queryState[itemName]
  const value: T = paramValue === undefined ? defaultValue : paramValue

  return [value, setQueryStateItem]
}
