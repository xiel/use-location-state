import {
  QueryStateOpts,
  Reducer,
  ReducerState,
  useQueryReducer as useQueryReducerImported,
  useQueryState as useQueryStateImported,
} from 'use-location-state'
import { useReactRouterQueryStringInterface } from './useReactRouterQueryStringInterface'

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts
) {
  return useQueryStateImported(itemName, defaultValue, {
    queryStringInterface: useReactRouterQueryStringInterface(),
    ...queryStateOpts,
  })
}

export function useQueryReducer<R extends Reducer<any, any>>(
  itemName: string,
  reducer: R,
  initialState: ReducerState<R>,
  queryStateOpts?: QueryStateOpts
) {
  return useQueryReducerImported(itemName, reducer, initialState, {
    queryStringInterface: useReactRouterQueryStringInterface(),
    ...queryStateOpts,
  })
}
