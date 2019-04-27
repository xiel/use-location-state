export type QueryStateValue = string | string[]
export type QueryStateResetValue = null | undefined
export type QueryState = Record<string, QueryStateValue>
export type QueryStateMerge = Record<string, QueryStateValue | QueryStateResetValue>

export function stripLeadingHashOrQuestionMark(s: string = '') {
  if (s && (s.indexOf('?') === 0 || s.indexOf('#') === 0)) {
    return s.slice(1)
  }
  return s
}

export function parseQueryState(queryString: string): QueryState | null {
  const queryState: QueryState = {}
  const params = new URLSearchParams(stripLeadingHashOrQuestionMark(queryString))

  params.forEach((value, key) => {
    if (key in queryState) {
      const queryStateForKey = queryState[key]

      if (Array.isArray(queryStateForKey)) {
        queryStateForKey.push(value)
      } else {
        queryState[key] = [queryStateForKey, value]
      }
    } else {
      queryState[key] = value
    }
  })

  return Object.keys(queryState).length ? queryState : null
}

export function createMergedQuery(...queryStates: QueryStateMerge[]) {
  const mergedQueryStates: QueryStateMerge = Object.assign({}, ...queryStates)
  const params = new URLSearchParams()

  Object.entries(mergedQueryStates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach(v => {
        params.append(key, v)
      })
    } else {
      params.append(key, value)
    }
  })

  params.sort()
  return params.toString()
}
