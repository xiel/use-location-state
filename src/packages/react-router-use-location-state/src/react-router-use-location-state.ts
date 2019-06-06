import { useQueryState as useQueryStateImported } from 'use-location-state'
import { useContext } from 'react'
import { QueryStateOpts, SetQueryStateItemFn } from 'use-location-state/dist/hooks/types'
import { useReactRouterQueryStringInterface } from './useHistoryQueryState'
import { __RouterContext as RouterContext } from 'react-router'

export function useRouter() {
  const router = useContext(RouterContext)

  if(process.env.NODE_ENV !== "production"){
    if(!router) {
      console.error({ RouterContext, router })
      // throw new Error('Router missing')
    }
  }

  return router
}

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {
  const router = useRouter()
  let queryStringInterface;

  if(router && router.history) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryStringInterface = useReactRouterQueryStringInterface(router.history)
  } else {
    console.warn('useRouter - router was not found')
  }

  return useQueryStateImported(itemName, defaultValue, {
    queryStringInterface,
    ...queryStateOpts
  })
}
