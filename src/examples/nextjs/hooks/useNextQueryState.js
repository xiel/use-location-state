import { useRouter } from 'next/router'
import { useQueryState } from 'use-location-state'

export function useNextQueryState(key, defaultValue) {
  const router = useRouter()
  return useQueryState(key, defaultValue, {
    queryStringInterface: {
      getQueryString: () => router.asPath.split('?')[1],
      setQueryString: (newQueryString, { method = 'replace' }) => {
        router[method](router.pathname + '?' + newQueryString)
      },
    },
  })
}
