import { useQueryState as useQueryStateImported } from 'use-location-state'

// @ts-ignore
import { __RouterContext as RouterContext, RouteComponentProps } from 'react-router'
import { useContext } from 'react'
import { QueryStateOpts, SetQueryStateItemFn } from 'use-location-state/dist/hooks/types'

function useRouter<T = {}>(): RouteComponentProps<T> {
  if (!RouterContext) {
    throw new Error('useRouter can only be used with react-router@^5.')
  }
  return useContext(RouterContext)
}

export function useQueryState<T>(
  itemName: string,
  defaultValue: T,
  queryStateOpts?: QueryStateOpts
): [T, SetQueryStateItemFn<T>] {
  // const router = useRouter()
  // console.log({ itemName, defaultValue, queryStateOpts })
  // console.log('router', router)

  return useQueryStateImported(itemName, defaultValue, {
    ...queryStateOpts
  })
}
