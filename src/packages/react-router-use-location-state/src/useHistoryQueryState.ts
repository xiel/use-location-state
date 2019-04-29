import * as H from 'history'
import { QueryStringInterface } from 'use-location-state/dist/hooks/types'
import { useQueryState } from 'use-location-state'

function useReactRouterQueryStringInterface(history: H.History): QueryStringInterface {
  return {
    getQueryString: () => history.location.search,
    setQueryString: (newQueryString, { method }) =>
      history[method || 'replace'](
        `${history.location.pathname}?${newQueryString}${history.location.hash}`
      ),
  }
}

// option for react-router < 5.0.0 or in case context is not available (anymore)
export function useHistoryQueryState<T>(itemName: string, defaultValue: T, history: H.History) {
  const queryStringInterface = useReactRouterQueryStringInterface(history)
  return useQueryState(itemName, defaultValue, {
    queryStringInterface,
  })
}
