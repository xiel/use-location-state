import {
  QueryStateOpts,
  SetQueryStateItemFn,
  useQueryState as useQueryStateImported,
} from 'use-location-state'
import { useContext } from 'react'
import { useReactRouterQueryStringInterface } from './useHistoryQueryState'
import { __RouterContext as RouterContext } from 'react-router'

export function useRouter() {
  return useContext(RouterContext)
}

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {
  const router = useRouter()
  let queryStringInterface

  if (router && router.history) {
    // eslint-disable-next-line react-app/react-hooks/rules-of-hooks
    queryStringInterface = useReactRouterQueryStringInterface(router.history)
  } else {
    console.warn('useRouter - router was not found')
  }

  return useQueryStateImported(itemName, defaultValue, {
    queryStringInterface,
    ...queryStateOpts,
  })
}
