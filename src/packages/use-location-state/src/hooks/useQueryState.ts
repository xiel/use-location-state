import { QueryStateOpts, SetQueryStateItemFn } from './types'
import { useCallback, useMemo } from 'react'
import { parseQueryStateValue, toQueryStateValue } from 'query-state-core'
import useQueryStateObj from './useQueryStateObj'

export default function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts: QueryStateOpts = {}
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

  const [queryState, setQueryState] = useQueryStateObj(defaultQueryState, queryStateOpts)
  const setQueryStateItem: SetQueryStateItemFn<T> = useCallback(
    (newValue, opts) => {
      // stringify the given value (or array of strings)
      let newQueryStateValue = toQueryStateValue(newValue)

      // warn when value type is not supported (do not warn when null was passed explicitly)
      if (
        (newQueryStateValue === null && newValue !== newQueryStateValue) ||
        !(
          newQueryStateValue !== null &&
          typeof parseQueryStateValue(newQueryStateValue, defaultValue) === typeof defaultValue
        )
      ) {
        console.warn(
          'value of ' +
            JSON.stringify(newValue) +
            ' is not supported. "' +
            itemName +
            '" will reset to default value',
          defaultValue
        )
        newQueryStateValue = null
      }

      // when new value is equal to default, we call setQueryState with a null value to reset query string
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
