import {
  LOCATION_STATE_KEY,
  LocationState,
  LocationStateInterface,
  LocationStateValue,
} from 'use-location-state'
import { useLocation, useNavigate } from 'react-router'

// Needed for updates that happen right after each other (sync) as we do not have access to the latest history ref (since react router v6)
let virtualState: LocationState | null = null

export function useReactRouterLocationStateInterface():
  | LocationStateInterface
  | undefined {
  const location = useLocation()
  const navigate = useNavigate()

  // Use the real one again as soon as location changes and update was incorporated
  virtualState = null

  return {
    getLocationState: () => {
      const historyState =
        virtualState || (location.state as Record<any, LocationStateValue>)
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

      virtualState = updatedState
    },
  }
}
