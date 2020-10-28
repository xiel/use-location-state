import { useEffect, useMemo, useState } from 'react'
import {
  LOCATION_STATE_KEY,
  LocationStateInterface,
} from './useLocationState.types'

interface Props {
  disabled?: boolean
}

const hasWindowHistory = typeof window !== `undefined` && 'history' in window

export default function useLocationStateInterface({
  disabled = false,
}: Props = {}) {
  const enabled = !disabled && hasWindowHistory

  // this state is used to trigger re-renders
  const [, setR] = useState(0)

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
          ''
        )

        // manually dispatch a hashchange event (replace state does not trigger this event)
        // so all subscribers get notified (old way for IE11)
        const customEvent = document.createEvent('CustomEvent')
        customEvent.initEvent('popstate', false, false)
        window.dispatchEvent(customEvent)
      },
    }),
    [enabled]
  )

  useEffect(() => {
    if (!enabled) return
    const popstateHandler = () => {
      setR((r) => r + 1)
    }
    window.addEventListener('popstate', popstateHandler, false)
    return () => window.removeEventListener('popstate', popstateHandler, false)
  }, [enabled])

  return locationStateInterface
}
