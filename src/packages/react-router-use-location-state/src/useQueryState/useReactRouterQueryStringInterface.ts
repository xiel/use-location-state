import { QueryStringInterface } from 'use-location-state'
import { useRouter } from '../helpers/useRouter'

export function useReactRouterQueryStringInterface(): QueryStringInterface | undefined {
  const router = useRouter()
  const history = router && router.history

  if (!history) {
    console.warn('useRouter - router was not found')
    return
  }

  return {
    getQueryString: () => history.location.search,
    setQueryString: (newQueryString, { method = 'replace' }) => {
      history[method](`${history.location.pathname}?${newQueryString}${history.location.hash}`)
    },
  }
}
