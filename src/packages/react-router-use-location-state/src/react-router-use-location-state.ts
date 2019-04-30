import { useQueryState as useQueryStateImported } from 'use-location-state'
import { useContext } from 'react'
import { QueryStateOpts, SetQueryStateItemFn } from 'use-location-state/dist/hooks/types'
import { useReactRouterQueryStringInterface } from './useHistoryQueryState'
// @ts-ignore
import { __RouterContext as RouterContext, RouteComponentProps } from 'react-router'

export function useRouter<T = {}>(): RouteComponentProps<T> {
  return useContext(RouterContext)
}

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {
  const router = useRouter()
  let queryStringInterface;

  if(router && router.history) {
    queryStringInterface = useReactRouterQueryStringInterface(router.history)
  } else {
    console.warn('useRouter - router was not found')
  }

  return useQueryStateImported(itemName, defaultValue, {
    queryStringInterface,
    ...queryStateOpts
  })
}
