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

// Needed for updates that happen right after each other (sync) as we do not have access to the latest history ref (since react router v6)
let virtualQueryString: null | string = null

const useNextRouterQueryStringInterface = (): QueryStringInterface => {
  const router = useRouter()

  // Use the real one again as soon as location changes and update was incorporated
  virtualQueryString = null

  return {
    getQueryString: () =>
      typeof virtualQueryString === 'string'
        ? virtualQueryString
        : router.asPath.split('?')[1],
    setQueryString: (newQueryString, { method = 'replace' }) => {
      virtualQueryString = newQueryString

      const startTransition = globalThis.requestAnimationFrame || setTimeout

      console.log('setQueryString', { startTransition, newQueryString, method })

      startTransition(() => {
        console.log('router set...')
        router[method](router.pathname + '?' + newQueryString)
      })
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
