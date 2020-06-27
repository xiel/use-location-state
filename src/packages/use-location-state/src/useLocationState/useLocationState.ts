/* eslint-disable react-hooks/rules-of-hooks */
import { LocationStateOpts } from './useLocationState.types'
import { Dispatch, useLocationReducer } from './useLocationReducer'

const locationStateOptsDefaults = Object.freeze({})

export type LazyValueFn<S> = () => S
export type SetStateAction<S> = S | ((prevState: S) => S)

export default function useLocationState<S>(
  itemName: string,
  initialState: S | LazyValueFn<S>,
  opts: LocationStateOpts = locationStateOptsDefaults
): [S, Dispatch<SetStateAction<S>>] {
  if (typeof initialState === 'function') {
    return useLocationReducer<S, SetStateAction<S>, any>(
      itemName,
      stateReducer,
      undefined,
      (initialState as unknown) as LazyValueFn<S>,
      opts
    )
  }
  return useLocationReducer<S, SetStateAction<S>>(
    itemName,
    stateReducer,
    (initialState as unknown) as S,
    opts
  )
}

function stateReducer<S>(prevState: S, action: SetStateAction<S>): S {
  if (action && typeof action === 'function') {
    return (action as (prevState: S) => S)(prevState)
  }
  return action
}
