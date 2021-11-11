import { useLocation, useNavigate } from 'react-router'
import { QueryStringInterface } from 'use-location-state'

export function useReactRouterQueryStringInterface():
  | QueryStringInterface
  | undefined {
  const location = useLocation()
  const navigate = useNavigate()

  return {
    getQueryString: () => location.search,
    setQueryString: (newQueryString, { method = 'replace' }) => {
      navigate(`${location.pathname}?${newQueryString}${location.hash}`, {
        replace: method === 'replace',
      })
    },
  }
}
