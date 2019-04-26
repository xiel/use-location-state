import { string } from 'prop-types'


export type QueryState = Record<string, string | string[]>

type QueryStateResetValue = null | undefined
export type QueryStateMergable = Record<string, string | string[] | QueryStateResetValue>

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

      if(Array.isArray(queryStateForKey)) {
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

export function createMergedQuery(...queryStates: QueryStateMergable[]) {
  const mergedQueryStates: QueryStateMergable = Object.assign({}, ...queryStates)
  const params = new URLSearchParams()

  Object.entries(mergedQueryStates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }
    if (typeof value === 'string') {
      params.append(key, value)
    } else {
      params.append(key, JSON.stringify(value))
    }
  })

  params.sort()
  return params.toString()
}
