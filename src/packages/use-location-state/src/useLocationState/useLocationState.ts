/* eslint-disable react-hooks/rules-of-hooks */
import { LocationStateOpts } from './useLocationState.types'
import { LocationDispatch, useLocationReducer } from './useLocationReducer'
import { LazyValueFn, SetStateAction } from '../types/sharedTypes'

const locationStateOptsDefaults = Object.freeze({})

export function useLocationState<S>(
  itemName: string,
  initialState: S | LazyValueFn<S>,
  opts: LocationStateOpts = locationStateOptsDefaults
): [S, LocationDispatch<SetStateAction<S>>] {
  if (typeof initialState === 'function') {
    return useLocationReducer<S, SetStateAction<S>, any>(
      itemName,
      stateReducer,
      undefined,
      initialState as unknown as LazyValueFn<S>,
      opts
    )
  }
  return useLocationReducer<S, SetStateAction<S>>(
    itemName,
    stateReducer,
    initialState as unknown as S,
    opts
  )
}

function stateReducer<S>(prevState: S, action: SetStateAction<S>): S {
  if (action && typeof action === 'function') {
    return (action as (prevState: S) => S)(prevState)
  }
  return action
}
