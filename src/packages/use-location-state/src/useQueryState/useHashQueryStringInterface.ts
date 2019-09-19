import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from './useQueryState.types'

interface Props {
  disabled?: boolean
}

const hasWindowLocation =
  typeof window !== `undefined` && 'location' in window && 'history' in window

export function useHashQueryStringInterface({
  disabled = false,
}: Props = {}): QueryStringInterface {
  const enabled = !disabled && hasWindowLocation
  const hashQSI: QueryStringInterface = useMemo(
    () => ({
      getQueryString: () => {
        if (!enabled) return ''
        return window.location.hash
      },
      setQueryString: (newQueryString, { method = 'replace' }) => {
        if (!enabled) return

        // use history to update hash using replace / push
        window.history[method === 'replace' ? 'replaceState' : 'pushState'](
          window.history.state,
          '',
          '#' + newQueryString
        )

        // manually dispatch a hashchange event (replace state does not trigger this event)
        // so all subscribers get notified (old way for IE11)
        const customEvent = document.createEvent('CustomEvent')
        customEvent.initEvent('hashchange', false, false)
        window.dispatchEvent(customEvent)

        setR(r => r + 1)
      },
    }),
    [enabled]
  )
  // this state is used to trigger re-renders
  const [, setR] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const hashChangeHandler = () => {
      setR(r => r + 1)
    }
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [enabled])

  return hashQSI
}
