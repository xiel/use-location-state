import { QueryStringInterface } from '../useQueryState.types'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function useTestQueryStringInterface(): QueryStringInterface {
  const [queryString, setQueryString] = useState('')
  const latestQueryString = useRef(queryString)

  useEffect(() => {
    latestQueryString.current = queryString
  })

  return useMemo(
    () => ({
      getQueryString: () => latestQueryString.current,
      setQueryString: newQueryString => {
        setQueryString(newQueryString)
      },
    }),
    []
  )
}
