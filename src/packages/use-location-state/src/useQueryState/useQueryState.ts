/* eslint-disable react-hooks/rules-of-hooks */
import { QueryStateOpts } from './useQueryState.types'
import { QueryDispatch, useQueryReducer } from './useQueryReducer'
import { LazyValueFn, Reducer, SetStateAction } from '../types/sharedTypes'
import { useCallback } from 'react'

export function useQueryState<S>(
  itemName: string,
  initialState: S | LazyValueFn<S>,
  queryStateOpts: QueryStateOpts = {}
): [S, QueryDispatch<SetStateAction<S>>] {
  const reducer: Reducer<S, SetStateAction<S>> = useCallback(
    (prevState: S, action: SetStateAction<S>) => {
      if (action && typeof action === 'function') {
        return (action as (prevState: S) => S)(prevState)
      }
      return action
    },
    []
  )

  if (typeof initialState === 'function') {
    return useQueryReducer(
      itemName,
      reducer,
      undefined,
      initialState as LazyValueFn<S>,
      queryStateOpts
    )
  }
  return useQueryReducer(itemName, reducer, initialState, queryStateOpts)
}
