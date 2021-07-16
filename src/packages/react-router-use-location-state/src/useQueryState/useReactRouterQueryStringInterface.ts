import { QueryStringInterface } from 'use-location-state'
import { useLocation, useNavigate } from 'react-router'

export function useReactRouterQueryStringInterface():
  | QueryStringInterface
  | undefined {
  const location = useLocation()
  const navigate = useNavigate()

  return {
    getQueryString: () => location.search,
    setQueryString: (newQueryString, { method = 'replace' }) => {
      navigate(
        {
          search: `?${newQueryString}`,
        },
        {
          replace: method === 'replace',
        }
      )
    },
  }
}
