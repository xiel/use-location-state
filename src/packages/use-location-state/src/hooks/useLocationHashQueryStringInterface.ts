import { useEffect, useMemo, useState } from 'react'
import { QueryStringInterface } from '../types'

export function useLocationHashQueryStringInterface(): QueryStringInterface {
  const [, setR] = useState(window.location.hash)
  const hashQueryStringInterface: QueryStringInterface = useMemo(
    () => ({
      getQueryString: () => window.location.hash,
      setQueryString: newQueryString => {
        window.location.hash = newQueryString
        setR((r) => r + 1)
      },
    }),
    []
  )

  useEffect(() => {
    const hashChangeHandler = () => setR((r) => r + 1)
    window.addEventListener('hashchange', hashChangeHandler, false)
    return () => window.removeEventListener('hashchange', hashChangeHandler, false)
  }, [])

  return hashQueryStringInterface
}
