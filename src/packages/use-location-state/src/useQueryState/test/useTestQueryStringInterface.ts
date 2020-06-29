import { QueryStringInterface } from '../useQueryState.types'
import { useRef, useState } from 'react'

export default function useTestQueryStringInterface(): QueryStringInterface {
  const [queryString, setQueryString] = useState('')
  const latestQueryString = useRef(queryString)

  return {
    getQueryString: () => latestQueryString.current,
    setQueryString: newQueryString => {
      latestQueryString.current = newQueryString
      setQueryString(newQueryString)
    },
  }
}
