import * as H from 'history'
import { QueryStringInterface } from 'use-location-state'

export function useReactRouterQueryStringInterface(history: H.History): QueryStringInterface {
  return {
    getQueryString: () => history.location.search,
    setQueryString: (newQueryString, { method = 'replace' }) => {
      history[method](`${history.location.pathname}?${newQueryString}${history.location.hash}`)
    },
  }
}
