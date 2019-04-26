export type QueryState = Record<string, unknown>

function tryJsonParseParamValue(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch (e) {}
  return value
}

export function stripLeadingHashOrQuestionMark(s: string = '') {
  if (s && (s.indexOf('?') === 0 || s.indexOf('#') === 0)) {
    return s.slice(1)
  }
  return s
}

export function parseQueryState(queryString: string): QueryState | null {
  const queryState: QueryState = {}
  const params = new URLSearchParams(stripLeadingHashOrQuestionMark(queryString))

  params.forEach((value, key) => (queryState[key] = tryJsonParseParamValue(value)))

  return Object.keys(queryState).length ? queryState : null
}

export function createMergedQuery(...queryStates: QueryState[]) {
  const mergedQueryStates: QueryState = Object.assign({}, ...queryStates)
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
