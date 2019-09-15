import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from './types'

interface Props {
  disabled?: boolean
}

const hasWindowLocation = typeof window !== `undefined` && 'location' in window

export function useLocationHashQueryStringInterface({
  disabled = false,
}: Props = {}): QueryStringInterface {
  const enabled = !disabled && hasWindowLocation
  const hashQSI: QueryStringInterface = useMemo(
    () => ({
      getQueryString: () => {
        if (!enabled) {
          return ''
        }
        return window.location.hash
      },
      setQueryString: (newQueryString: string, { method }) => {
        if (!enabled) return
        if (window.history && window.history.replaceState) {
          window.history[method === 'replace' ? 'replaceState' : 'pushState'](
            null,
            '',
            '#' + newQueryString
          )
        }
        window.location.hash = newQueryString
        setR(r => r + 1)
      },
    }),
    [enabled]
  )
  // this state is used to trigger re-renders
  const [, setR] = useState(0)

  useEffect(() => {
    if (!enabled) {
      return
    }
    const hashChangeHandler = () => setR(r => r + 1)
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [enabled])

  return hashQSI
}
