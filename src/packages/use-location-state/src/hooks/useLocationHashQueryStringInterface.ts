import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from '../use-location-state'

export function useLocationHashQueryStringInterface(): QueryStringInterface {
  const [hashQueryString, setHashQueryString] = useState(location.hash)

  useEffect(() => {
    const hashChangeHandler = () => setHashQueryString(location.hash)
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [])

  const qsi: QueryStringInterface = useMemo(
    () => ({
      getQueryString: () => hashQueryString,
      setQueryString: newQueryString => {
        location.hash = newQueryString
        setHashQueryString(location.hash)
      },
    }),
    [hashQueryString]
  )

  return qsi
}
