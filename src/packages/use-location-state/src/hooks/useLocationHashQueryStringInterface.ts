import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from '../types'

export function useLocationHashQueryStringInterface(): QueryStringInterface {
  const [_, setHashQueryString] = useState(window.location.hash)

  useEffect(() => {
    const hashChangeHandler = () => setHashQueryString(window.location.hash)
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [])

  return useMemo(
    () => ({
      getQueryString: () => window.location.hash,
      setQueryString: newQueryString => {
        window.location.hash = newQueryString
        setHashQueryString(window.location.hash)
      },
    }),
    []
  )
}
