import {
  LocationStateOpts,
  Reducer,
  ReducerState,
  SetLocationState,
  useLocationState as useLocationStateImported,
  useLocationReducer as useLocationReducerImported,
} from 'use-location-state'
import { useReactRouterLocationStateInterface } from './useReactRouterLocationStateInterface'

export function useLocationState<S>(
  itemName: string,
  defaultValue: S | (() => S)
): [S, SetLocationState<S>] {
  return useLocationStateImported(itemName, defaultValue, {
    locationStateInterface: useReactRouterLocationStateInterface(),
  })
}

export function useLocationReducer<R extends Reducer<any, any>>(
  itemName: string,
  reducer: R,
  initialState: ReducerState<R>,
  locationStateOpts?: LocationStateOpts
) {
  return useLocationReducerImported(itemName, reducer, initialState, {
    locationStateInterface: useReactRouterLocationStateInterface(),
    ...locationStateOpts,
  })
}
