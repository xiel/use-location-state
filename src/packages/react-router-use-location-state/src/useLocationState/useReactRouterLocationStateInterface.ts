import { LOCATION_STATE_KEY, LocationStateInterface, LocationStateValue } from 'use-location-state'
import { useRouter } from '../helpers/useRouter'

export function useReactRouterLocationStateInterface(): LocationStateInterface | undefined {
  const router = useRouter()
  const history = router && router.history

  if (!history) {
    console.warn('useRouter - router was not found')
    return
  }

  return {
    getLocationState: () => {
      const historyState = history.location.state as Record<any, LocationStateValue>
      return (
        (historyState && LOCATION_STATE_KEY in historyState && historyState[LOCATION_STATE_KEY]) ||
        {}
      )
    },
    setLocationState: (nextState, { method = 'replace' }) => {
      const historyState = history.location.state || {}
      const updatedState = {
        ...historyState,
        [LOCATION_STATE_KEY]: nextState,
      }
      // create current href, history re-routes incorrectly to "/" for ""
      history[method](history.createHref(history.location), updatedState)
    },
  }
}
