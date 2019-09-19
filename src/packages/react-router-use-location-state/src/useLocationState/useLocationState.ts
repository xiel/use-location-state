import { SetLocationState, useLocationState as useLocationStateImported } from 'use-location-state'
import { useReactRouterLocationStateInterface } from './useReactRouterLocationStateInterface'

export function useLocationState<S>(
  itemName: string,
  defaultValue: S | (() => S)
): [S, SetLocationState<S>] {
  return useLocationStateImported(itemName, defaultValue, {
    locationStateInterface: useReactRouterLocationStateInterface(),
  })
}
