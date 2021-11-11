import {
  LOCATION_STATE_KEY,
  LocationStateInterface,
  LocationStateValue,
} from 'use-location-state'
import { useLocation, useNavigate } from 'react-router'

export function useReactRouterLocationStateInterface():
  | LocationStateInterface
  | undefined {
  const location = useLocation()
  const navigate = useNavigate()

  return {
    getLocationState: () => {
      const historyState = location.state as Record<any, LocationStateValue>
      return (
        (historyState &&
          LOCATION_STATE_KEY in historyState &&
          historyState[LOCATION_STATE_KEY]) ||
        {}
      )
    },
    setLocationState: (nextState, { method = 'replace' }) => {
      const historyState = location.state || {}
      const updatedState = {
        ...historyState,
        [LOCATION_STATE_KEY]: nextState,
      }

      navigate(location, {
        state: updatedState,
        replace: method === 'replace',
      })
    },
  }
}
