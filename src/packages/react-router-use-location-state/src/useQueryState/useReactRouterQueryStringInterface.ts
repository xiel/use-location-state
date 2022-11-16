import { useLocation, useNavigate } from 'react-router'
import { QueryStringInterface } from 'use-location-state'

// Needed for updates that happen right after each other (sync) as we do not have access to the latest history ref (since react router v6)
let virtualQueryString: null | string = null

export function useReactRouterQueryStringInterface():
  | QueryStringInterface
  | undefined {
  const location = useLocation()
  const navigate = useNavigate()

  // Use the real one again as soon as location changes and update was incorporated
  virtualQueryString = null

  return {
    getQueryString: () => {
      return typeof virtualQueryString === 'string'
        ? virtualQueryString
        : location.search
    },
    setQueryString: (newQueryString, { method = 'replace' }) => {
      navigate(`${location.pathname}?${newQueryString}${location.hash}`, {
        replace: method === 'replace',
      })
      virtualQueryString = newQueryString
    },
  }
}
