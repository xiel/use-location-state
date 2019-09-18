import { QueryStateOpts, SetQueryStateItemFn, useQueryState as useQueryStateImported } from 'use-location-state'
import { useReactRouterQueryStringInterface } from './useReactRouterQueryStringInterface'

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts,
): [T, SetQueryStateItemFn<T>] {
  return useQueryStateImported(itemName, defaultValue, {
    queryStringInterface: useReactRouterQueryStringInterface(),
    ...queryStateOpts,
  })
}
