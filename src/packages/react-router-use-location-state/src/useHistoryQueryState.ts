import * as H from 'history'
import { QueryStringInterface } from 'use-location-state/dist/hooks/types'

export function useReactRouterQueryStringInterface(history: H.History): QueryStringInterface {
  return {
    getQueryString: () => history.location.search,
    setQueryString: (newQueryString, { method }) =>
      history[method || 'replace'](
        `${history.location.pathname}?${newQueryString}${history.location.hash}`
      ),
  }
}
