import { QueryStateOpts, SetQueryStateFn, SetQueryStateItemFn } from './types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  createMergedQuery,
  parseQueryState,
  parseQueryStateValue,
  QueryState,
  QueryStateMerge,
  toQueryStateValue,
} from 'query-state-core'

export function useLocationQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOpts
): [QueryState, SetQueryStateFn<T>] {
  const { queryStringInterface } = queryStateOpts
  const queryString = queryStringInterface.getQueryString()
  const [, setLatestMergedQueryString] = useState<string>()
  const queryState = useMemo(
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

  const setQueryState: SetQueryStateFn<T> = useCallback((newState, opts) => {
    const { defaultQueryState, queryStateOpts } = ref.current
    const { queryStringInterface, stripDefaults = true } = queryStateOpts
    const stripOverwrite: QueryStateMerge = {}

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
    const currentQueryState: QueryState = {
      ...defaultQueryState,
      ...parseQueryState(queryStringInterface.getQueryString()),
    }

    const mergedQueryString = createMergedQuery(currentQueryState || {}, newState, stripOverwrite)

    queryStringInterface.setQueryString(mergedQueryString, opts || {})

    // triggers an update (in case the QueryStringInterface misses to do so)
    setLatestMergedQueryString(mergedQueryString)
  }, [])

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
  const defaultQueryStateValue = toQueryStateValue(defaultValue)
  const defaultQueryState = useMemo(() => {
    return defaultQueryStateValue
      ? {
          [itemName]: defaultQueryStateValue,
        }
      : {}
  }, [itemName, defaultQueryStateValue])

  if (defaultQueryStateValue === null) {
    throw new Error('unsupported defaultValue')
  }

  const [queryState, setQueryState] = useLocationQueryStateObj(defaultQueryState, queryStateOpts)
  const setQueryStateItem: SetQueryStateItemFn<T> = useCallback(
    (newValue, opts) => {
      // stringify the given value (or array of strings)
      let newQueryStateValue = toQueryStateValue(newValue)

      // warn when value type is not supported
      if (newQueryStateValue === null && newValue !== newQueryStateValue) {
        console.warn(
          'value ' +
            newValue +
            ' is not supported will. "' +
            itemName +
            '" will reset to default value',
          defaultValue
        )
      }

      // when new value is qual to default, we call setQueryState with a null value to reset query string
      if (newValue === defaultValue) {
        newQueryStateValue = null
      }

      setQueryState({ [itemName]: newQueryStateValue }, opts)
    },
    [itemName, setQueryState]
  )

  // fallback to default value
  let value = defaultValue
  const queryStateItem = queryState[itemName]
  let queryStateValue = null

  if (queryStateItem || queryStateItem === '') {
    queryStateValue = parseQueryStateValue(queryStateItem, defaultValue)
  }

  if (queryStateValue !== null && typeof queryStateValue === typeof defaultValue) {
    value = queryStateValue as any
  }

  return [value, setQueryStateItem]
}
