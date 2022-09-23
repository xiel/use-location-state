import { useRouter } from 'next/router'
import { useQueryState as useQueryStateOrg } from './useQueryState/useQueryState'
import { useQueryReducer as useQueryReducerOrg } from './useQueryState/useQueryReducer'
import { Reducer, ReducerState } from './types/sharedTypes'
import {
  QueryStateOpts,
  QueryStringInterface,
} from './useQueryState/useQueryState.types'
import { GetServerSideProps } from 'next'
export * from './useLocationState/useLocationState'

const useNextRouterQueryStringInterface = (): QueryStringInterface => {
  const router = useRouter()

  return {
    getQueryString: () => router.asPath.split('?')[1],
    setQueryString: (newQueryString, { method = 'replace' }) => {
      router[method](router.pathname + '?' + newQueryString)
    },
  }
}

export const useQueryState: typeof useQueryStateOrg = (key, defaultValue) => {
  return useQueryStateOrg(key, defaultValue, {
    queryStringInterface: useNextRouterQueryStringInterface(),
  })
}

export function useQueryReducer<R extends Reducer<any, any>>(
  itemName: string,
  reducer: R,
  initialState: ReducerState<R>,
  queryStateOpts?: QueryStateOpts
) {
  return useQueryReducerOrg(itemName, reducer, initialState, {
    queryStringInterface: useNextRouterQueryStringInterface(),
    ...queryStateOpts,
  })
}

/**
 * Empty getServerSideProps to trigger server-side rendering and give router access to query. (static rendered pages may not rely on query)
 * This fixes hydration warnings e.g. Warning: Text content did not match. Server: "xzy" Client: "abc"
 */
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} }
}
