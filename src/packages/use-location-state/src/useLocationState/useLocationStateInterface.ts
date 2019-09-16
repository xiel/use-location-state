import { useMemo } from 'react'
import { LocationStateInterface } from './useLocationState.types'

interface Props {
  disabled?: boolean
}

const LOCATION_STATE_KEY = '__useLocationState'
const hasWindowHistory = typeof window !== `undefined` && 'history' in window

export default function useLocationStateInterface({ disabled = false }: Props) {
  const enabled = !disabled && hasWindowHistory
  const locationStateInterface: LocationStateInterface = useMemo(
    () => ({
      getLocationState: () => {
        if (!enabled) return {}
        const historyState = window.history.state
        return (
          (historyState &&
            LOCATION_STATE_KEY in historyState &&
            historyState[LOCATION_STATE_KEY]) ||
          {}
        )
      },
      setLocationState: (nextState, { method = 'replace' }) => {
        if (!enabled) return null

        const historyState = window.history.state || {}
        const updatedState = {
          ...historyState,
          [LOCATION_STATE_KEY]: nextState,
        }

        // update history state using replace / push
        window.history[method === 'replace' ? 'replaceState' : 'pushState'](
          updatedState,
          '',
          undefined
        )
      },
    }),
    [enabled]
  )

  return locationStateInterface
}
