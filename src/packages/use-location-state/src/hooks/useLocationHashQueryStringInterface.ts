import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from '../types'

interface Props {
  disabled?: boolean
}

export function useLocationHashQueryStringInterface({
  disabled = false,
}: Props = {}): QueryStringInterface {
  const hashQSI: QueryStringInterface = useMemo(
    () => ({
      getQueryString: () => {
        if (disabled) {
          return ''
        }
        return window.location.hash
      },
      setQueryString: newQueryString => {
        if (!disabled) {
          window.location.hash = newQueryString
          setR(r => r + 1)
        }
      },
    }),
    [disabled]
  )
  // this state is used to trigger re-renders
  const [, setR] = useState(hashQSI.getQueryString())

  useEffect(() => {
    if (disabled) {
      return
    }
    const hashChangeHandler = () => setR(r => r + 1)
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [disabled])

  return hashQSI
}
