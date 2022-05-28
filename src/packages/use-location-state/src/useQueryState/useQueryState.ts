/* eslint-disable react-hooks/rules-of-hooks */
import { QueryStateOpts } from './useQueryState.types'
import { QueryDispatch, useQueryReducer } from './useQueryReducer'
import { LazyValueFn, Reducer, SetStateAction } from '../types/sharedTypes'
import { useCallback } from 'react'
import { ValueType } from 'query-state-core'

type ItemType<S> = S extends infer U | ValueType ? U : never

export function useQueryState<S>(
  itemName: string,
  initialState: ItemType<S> | LazyValueFn<ItemType<S>>,
  queryStateOpts: QueryStateOpts = {}
): [S, QueryDispatch<SetStateAction<S>>] {
  const reducer: Reducer<any, SetStateAction<S>> = useCallback(
    (prevState, action) => {
      if (action && typeof action === 'function') {
        // @ts-expect-error no callable
        return action(prevState)
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
      initialState,
      queryStateOpts
    )
  }

  return useQueryReducer(itemName, reducer, initialState, queryStateOpts)
}
