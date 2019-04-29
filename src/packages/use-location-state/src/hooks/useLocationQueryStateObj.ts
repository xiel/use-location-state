import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMergedQuery, parseQueryState, QueryState, QueryStateMerge } from 'query-state-core'
import { useLocationHashQueryStringInterface } from './useLocationHashQueryStringInterface'
import { QueryStateOpts, SetQueryStateFn } from './types'

export default function useLocationQueryStateObj<T extends QueryState>(
  defaultQueryState: T,
  queryStateOpts: QueryStateOpts,
): [QueryState, SetQueryStateFn<T>] {
  const { queryStringInterface } = queryStateOpts
  const hashQSI = useLocationHashQueryStringInterface({ disabled: !!queryStringInterface })
  const activeQSI = queryStringInterface || hashQSI
  const queryString = activeQSI.getQueryString()
  const [, setLatestMergedQueryString] = useState<string>()
  const queryState = useMemo(
    () => ({
      ...defaultQueryState,
      ...parseQueryState(queryString),
    }),
    [defaultQueryState, queryString],
  )

  const ref = useRef({
    defaultQueryState,
    queryStateOpts,
    activeQSI,
  })

  const setQueryState: SetQueryStateFn<T> = useCallback((newState, opts) => {
    const { defaultQueryState, queryStateOpts, activeQSI } = ref.current
    const { stripDefaults = true } = queryStateOpts
    const stripOverwrite: QueryStateMerge = {}

    // when a params are set to the same value as in the defaults
    // we remove them to avoid having two URLs reproducing the same state unless stripDefaults === false
    if (stripDefaults) {
      Object.entries(newState).forEach(([key]) => {
        if (defaultQueryState[key] === newState[key]) {
          stripOverwrite[key] = null
        }
      })
    }

    // retrieve the last value (by re-executing the search getter)
    const currentQueryState: QueryState = {
      ...defaultQueryState,
      ...parseQueryState(activeQSI.getQueryString()),
    }

    const mergedQueryString = createMergedQuery(currentQueryState || {}, newState, stripOverwrite)

    activeQSI.setQueryString(mergedQueryString, opts || {})

    // triggers an update (in case the QueryStringInterface misses to do so)
    setLatestMergedQueryString(mergedQueryString)
  }, [])

  useEffect(() => {
    ref.current = {
      defaultQueryState,
      queryStateOpts,
      activeQSI,
    }
  })

  return [queryState, setQueryState]
}
